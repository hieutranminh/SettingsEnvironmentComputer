# Excel Download Demo với ExcelJS

## Tổng quan

Đã thay thế hàm `convertTableToExcelFormat` dư thừa bằng chức năng download Excel sử dụng thư viện ExcelJS. Hàm mới `downloadExcel` trực tiếp xử lý dữ liệu từ `state.value.sections[0].sectionRef` mà không cần chuyển đổi trung gian.

## Thay đổi chính

### 1. Xóa hàm dư thừa

- ❌ `convertTableToExcelFormat` - không còn cần thiết
- ❌ `customExcelHandler` - không còn sử dụng

### 2. Thêm ExcelJS

- ✅ Import ExcelJS từ package đã cài đặt
- ✅ Tạo workbook và worksheet trực tiếp
- ✅ Xử lý dữ liệu table element

### 3. Chức năng mới

- ✅ Tạo header với title, subtitle, date range, total items
- ✅ Xử lý table headers với colspan/rowspan
- ✅ Xử lý table body data
- ✅ Auto-fit columns
- ✅ Download file Excel (.xlsx)

## Cách sử dụng

```typescript
// Trong component Vue
import { usePrintPreviewStore } from '@/stores/print-preview.store'

const printPreviewStore = usePrintPreviewStore()

// Download Excel
const handleDownloadExcel = async () => {
  try {
    await printPreviewStore.downloadExcel('report-name')
  } catch (error) {
    console.error('Failed to download Excel:', error)
  }
}
```

## Ưu điểm của ExcelJS

1. **Hiệu suất cao**: Xử lý trực tiếp DOM elements
2. **Tính năng phong phú**: Hỗ trợ merged cells, styling, formatting
3. **Tương thích tốt**: File Excel chuẩn, mở được trên mọi ứng dụng
4. **Dễ bảo trì**: Code rõ ràng, không có logic dư thừa

## Cấu trúc file Excel

```
Row 1: Title (merged across columns, bold, size 16)
Row 2: Subtitle (merged across columns, size 14)
Row 3: Date Range (merged across columns, size 12)
Row 4: Total Items (merged across columns, size 12)
Row 5: Generated at: YYYY-MM-DD (ddd) (merged, size 10, gray)
Row 6: Empty spacing
Row 7+: Table headers (with colspan/rowspan support)
Row N+: Table body data
```

## Xử lý merged cells

Hàm tự động phát hiện và xử lý:

- `colspan` - merge cells theo chiều ngang
- `rowspan` - merge cells theo chiều dọc
- Styling cho headers (bold, background color, borders)
- Styling cho body (normal font, borders, alignment)
