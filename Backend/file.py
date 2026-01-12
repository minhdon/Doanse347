import pandas as pd

# 1. Đọc file CSV gốc (Thay tên file của bạn vào đây)
df = pd.read_csv('drug_data.csv')
df=df.dropna()  # Loại bỏ các dòng có giá trị thiếu (nếu cần)
df=df.drop(columns=['Product URL','Origin','Crawled At'])  # Loại bỏ cột không cần thiết

# 2. Lấy ngẫu nhiên 500 dòng
# n=500: số dòng muốn lấy
# random_state=1: giúp kết quả giống nhau mỗi lần chạy (nếu muốn ngẫu nhiên hoàn toàn thì xóa đoạn này đi)
group_lienhe = df[df['Price'] == 'Liên hệ']

# Nhóm B: Những dòng còn lại (Không phải 'Liên hệ')
group_khac = df[df['Price'] != 'Liên hệ']

# ---------------------------------------------------------

# 3. Random lấy dữ liệu từ từng nhóm
# Kiểm tra xem có đủ 100 dòng 'Liên hệ' không
if len(group_lienhe) >= 100:
    sample_lienhe = group_lienhe.sample(n=100)
else:
    print(f"Cảnh báo: Chỉ có {len(group_lienhe)} dòng 'Liên hệ'. Sẽ lấy tất cả số này.")
    sample_lienhe = group_lienhe

# Lấy 400 dòng từ nhóm còn lại
# (Hoặc lấy bù thêm nếu nhóm 'Liên hệ' không đủ 100, nhưng ở đây mình để cố định 400 cho đơn giản)
sample_khac = group_khac.sample(n=400)

# ---------------------------------------------------------

# 4. Gộp 2 nhóm lại và trộn đều (Shuffle)
final_df = pd.concat([sample_lienhe, sample_khac])

# Trộn ngẫu nhiên vị trí các dòng để 'Liên hệ' không bị dồn cục lại một chỗ
final_df = final_df.sample(frac=1).reset_index(drop=True)

# 5. Lưu ra file mới
final_df.to_csv('drug_data_mixed.csv', index=False)

print("Đã xong! File 'drug_data_mixed.csv' có:")
print(f"- {len(sample_lienhe)} dòng 'Liên hệ'")
print(f"- {len(sample_khac)} dòng giá khác")
print(f"- Tổng cộng: {len(final_df)} dòng.")