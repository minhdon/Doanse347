import json
import os
import requests # Thư viện để gọi API
from sentence_transformers import SentenceTransformer

# 1. Cấu hình
# Thay đường dẫn này bằng URL API thật của bạn (ví dụ: http://127.0.0.1:8000/api/medicines/)
API_URL = "http://127.0.0.1:8000/?format=json" 
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'processed_drugs.json')

model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

def run_embedding():
    try:
        # 2. Gọi API để lấy dữ liệu raw
        print(f"Đang lấy dữ liệu từ API: {API_URL}...")
        response = requests.get(API_URL)
        response.raise_for_status() # Kiểm tra nếu gọi API lỗi
        drugs = response.json() 
        
        if not drugs:
            print("Cảnh báo: API trả về danh sách rỗng.")
            return

        # 3. Quá trình tạo Vector
        print(f"Đã nhận {len(drugs)} thuốc. Đang bắt đầu tạo Vector...")
        for drug in drugs:
            # Lưu ý: 'productDesc' phải khớp với key trong JSON của API trả về
            text_to_embed = drug.get('productDesc', '')
            if text_to_embed:
                embedding = model.encode(text_to_embed)
                drug['embedding'] = embedding.tolist()
            else:
                drug['embedding'] = []

        # 4. Lưu vào file processed_drugs.json để Backend Django sử dụng
        with open(OUTPUT_DATA_PATH, 'w', encoding='utf-8') as f:
            json.dump(drugs, f, ensure_ascii=False, indent=4)
        
        print(f"Thành công! Đã cập nhật bộ não tại: {OUTPUT_DATA_PATH}")

    except Exception as e:
        print(f"Lỗi xảy ra: {e}")

if __name__ == "__main__":
    run_embedding()