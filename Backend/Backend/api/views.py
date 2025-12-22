from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from base.models import Item
from .serializer import ItemSerializer
from sentence_transformers import SentenceTransformer
from scipy.spatial.distance import cosine
import json
import os
import google.generativeai as genai

@api_view(['GET'])
def getData(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def addItem(request):
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        


@api_view(['PUT', 'PATCH'])
def updateItem(request, pk):
    item = get_object_or_404(Item, pk=pk)
    serializer = ItemSerializer(item, data=request.data, partial=request.method == 'PATCH')
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# --- CẤU HÌNH ---
# Lấy API Key tại: https://aistudio.google.com/
genai.configure(api_key="AIzaSyA0TyM3eTfyGfG0t3NU_ZJLQbUND7h6iFo")

# Liệt kê models khả dụng (để debug)
print("=== AVAILABLE GEMINI MODELS ===")
try:
    for m in genai.list_models():
        if 'generateContent' in [method.name for method in m.supported_generation_methods]:
            print(f"  - {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")
print("================================")

gemini_model = genai.GenerativeModel('models/gemini-1.5-flash')

# Load model Vector (load 1 lần khi khởi động)
embedding_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# Đường dẫn dữ liệu
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'processed_drugs.json')

with open(DATA_PATH, 'r', encoding='utf-8') as f:
    DRUGS_DATA = json.load(f)

def get_relevant_drugs(user_query, top_k=5):
    """Tìm Top K thuốc có vector gần nhất với câu hỏi"""
    query_vector = embedding_model.encode(user_query)
    scored_drugs = []
    
    for drug in DRUGS_DATA:
        score = 1 - cosine(query_vector, drug['embedding'])
        scored_drugs.append({**drug, "score": score})
    
    # Sắp xếp theo score giảm dần
    scored_drugs.sort(key=lambda x: x['score'], reverse=True)
    return scored_drugs[:top_k]

@api_view(['POST'])
def chatbot_recommend(request):
    user_message = request.data.get('message', '')
    
    if not user_message:
        return Response({"reply": "Chào bạn, tôi có thể giúp gì cho bạn?"})

    # BƯỚC 1: Lấy dữ liệu liên quan từ Database (Retrieval)
    relevant_drugs = get_relevant_drugs(user_message)
    
    # BƯỚC 2: Tạo ngữ cảnh (Context) cho Gemini
    context = ""
    for d in relevant_drugs:
        context += f"- Tên thuốc: {d['productName']}\n  Mô tả: {d['productDesc']}\n\n"

    # BƯỚC 3: Xây dựng Prompt "ép" Gemini trả lời dựa trên dữ liệu
    prompt = f"""
    Bạn là một dược sĩ tư vấn thông minh. Nhiệm vụ của bạn là đọc danh sách thuốc được cung cấp và trả lời câu hỏi của khách hàng.

    DANH SÁCH THUỐC TRONG KHO:
    {context}

    CÂU HỎI CỦA KHÁCH HÀNG:
    "{user_message}"

    HƯỚNG DẪN TRẢ LỜI:
    1. Nếu khách hỏi về triệu chứng, hãy chọn ra các loại thuốc PHÙ HỢP NHẤT từ danh sách trên. 
    2. Nếu không có thuốc nào trong danh sách thực sự phù hợp, hãy nói: "Tôi không tìm thấy thuốc phù hợp chính xác với triệu chứng của bạn trong kho hiện tại."
    3. Trình bày ngắn gọn, dễ hiểu, có liệt kê tên thuốc nếu có.
    4. BẮT BUỘC có câu: "Lưu ý: Thông tin này chỉ mang tính chất tham khảo, bạn cần hỏi ý kiến bác sĩ trước khi sử dụng." ở cuối.
    5. Không được tự bịa ra tên thuốc không có trong danh sách trên.
    """

    # BƯỚC 4: Gọi Gemini để tạo câu trả lời (Generation)
    try:
        response = gemini_model.generate_content(prompt)
        return Response({
            "reply": response.text,
            "recommended_drugs": [
                {"name": d['productName'], "desc": d['productDesc'], "score": d['score']} 
                for d in relevant_drugs if d['score'] > 0.4 # Chỉ gửi lại list thuốc nếu độ khớp ổn
            ]
        })
    except Exception as e:
        import traceback
        error_detail = str(e)
        print(f"[GEMINI ERROR] {error_detail}")
        print(traceback.format_exc())
        return Response({
            "reply": f"Lỗi Gemini API: {error_detail}",
            "error_type": type(e).__name__
        }, status=500)