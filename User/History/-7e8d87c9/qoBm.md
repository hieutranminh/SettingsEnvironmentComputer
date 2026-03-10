# Fix for Overlapping TABLE Sections in Print Preview

## **Vấn đề đã được xác định:**

Khi có 2 section 'TABLE' trong `printSections`, table thứ 2 đang đè lên table thứ nhất do:

1. **Ước tính sai vị trí Y**: Code cũ sử dụng ước tính cố định cho chiều cao table
2. **Không có kiểm tra page break**: Không tự động tạo trang mới khi cần thiết
3. **Logic tính toán vị trí Y không chính xác**: Dẫn đến việc các table bị chồng lên nhau

## **Giải pháp đã triển khai:**

### 1. **Cải thiện kiểm tra page break**

- Thêm kiểm tra `availableHeight` trước khi vẽ table
- Tự động tạo trang mới khi `startY > availableHeight`
- Reset vị trí Y về đầu trang mới

### 2. **Tính toán chiều cao table chính xác hơn**

- Tạo hàm `calculateTableHeight()` để ước tính chiều cao table
- Tính toán dựa trên số lượng rows, header, footer thực tế
- Sử dụng `minCellHeight` từ styles để tính toán chính xác

### 3. **Cải thiện logic vị trí Y**

- Loại bỏ ước tính cố định `estimatedRowHeight = 12`
- Sử dụng chiều cao thực tế của table để tính toán
- Thêm spacing 15pt giữa các section

### 4. **Xử lý table span nhiều trang**

- Kiểm tra nếu table quá cao so với không gian còn lại
- Tự động điều chỉnh vị trí Y để tránh overlap

## **Code đã được sửa đổi:**

- `src/stores/print-preview.store.ts` - Hàm `processTableSection`
- Thêm hàm helper `calculateTableHeight`
- Cải thiện logic page break và vị trí Y

## **Kết quả mong đợi:**

- Các table sẽ không còn bị đè lên nhau
- Tự động tạo trang mới khi cần thiết
- Vị trí Y được tính toán chính xác giữa các section
- Spacing phù hợp giữa các table

## **Cách sử dụng:**

Không cần thay đổi cách sử dụng, chỉ cần gọi `openPrintPreview` với `printSections` như bình thường. Code sẽ tự động xử lý việc sắp xếp các table để không bị overlap.
