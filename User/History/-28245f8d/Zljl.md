# PDF Constants Migration Guide

## 📋 **Tổng quan thay đổi**

Constants PDF đã được tổ chức lại thành 5 nhóm chức năng rõ ràng:

1. **`layout.ts`** - Kích thước trang, margins, spacing
2. **`typography.ts`** - Font sizes, weights, alignment
3. **`styling.ts`** - Colors, borders, table styles
4. **`formatting.ts`** - File formats, orientations, date formats
5. **`rendering.ts`** - Canvas, image, text rendering config

## 🔄 **Mapping từ constants cũ sang mới**

### **Layout Constants**

| Cũ | Mới | Ghi chú |
|---|---|---|
| `PAGE_DIMENSIONS` | `PDF_PAGE_DIMENSIONS` | Thêm A3 format |
| `PDF_LAYOUT_CONSTANTS` | Tách thành `PDF_MARGINS`, `PDF_SECTION_SPACING`, `PDF_HEADER` | Tách theo chức năng |
| `SPACING` | `PDF_MARGINS`, `PDF_SECTION_SPACING`, `PDF_TEXT_SPACING` | Tách theo loại spacing |
| `CANVAS_CONFIG` | `PDF_CANVAS_CONFIG` | Thêm prefix PDF_ |
| `TABLE_CONFIG` | `PDF_CELL_HEIGHTS`, `PDF_TABLE_RENDERING` | Tách theo chức năng |

### **Typography Constants**

| Cũ | Mới | Ghi chú |
|---|---|---|
| `FONT_SIZES` | `PDF_FONT_SIZES` | Thêm prefix PDF_ và tổ chức lại |
| `PDF_FONT_SIZES` | `PDF_FONT_SIZES` | Merge và tổ chức lại |
| `ALIGNMENT` | `PDF_TEXT_ALIGNMENT` | Thêm prefix PDF_ |

### **Styling Constants**

| Cũ | Mới | Ghi chú |
|---|---|---|
| `COLORS` | `PDF_COLORS` | Loại bỏ ARGB, chỉ giữ hex |
| `BORDER_STYLES` | `PDF_BORDER_STYLES` | Thêm prefix PDF_ |
| `PDF_TABLE_STYLES` | `PDF_TABLE_STYLES` | Tổ chức lại cấu trúc |

### **Formatting Constants**

| Cũ | Mới | Ghi chú |
|---|---|---|
| `PDF_FORMATS` | `PDF_DOCUMENT_FORMATS` | Tên rõ ràng hơn |
| `PDF_UNITS` | `PDF_UNITS` | Giữ nguyên |
| `PDF_ORIENTATIONS` | `PDF_ORIENTATIONS` | Giữ nguyên |
| `DATE_FORMATS` | `PDF_DATE_FORMATS` | Thêm prefix PDF_ |
| `AUTOTABLE_OPTIONS` | `PDF_AUTOTABLE_OPTIONS` | Thêm prefix PDF_ |
| `SUPPORTED_HTML_TAGS` | `PDF_SUPPORTED_HTML_TAGS` | Thêm prefix PDF_ |

### **Rendering Constants**

| Cũ | Mới | Ghi chú |
|---|---|---|
| `CANVAS_RENDER_OPTIONS` | `PDF_CANVAS_CONFIG` | Merge vào canvas config |
| `EXCEL_DIMENSIONS` | ❌ | Loại bỏ (chuyển sang Excel constants) |

## 🚀 **Cách sử dụng mới**

### **Import constants**

```typescript
// Cũ
import { PAGE_DIMENSIONS, SPACING, FONT_SIZES } from '@/composables/print/constants'

// Mới
import { 
  PDF_PAGE_DIMENSIONS, 
  PDF_MARGINS, 
  PDF_FONT_SIZES 
} from '@/composables/print/constants/pdf'
```

### **Sử dụng trong code**

```typescript
// Cũ
const pageWidth = PAGE_DIMENSIONS.A4.PORTRAIT.WIDTH
const margin = SPACING.MARGIN.TOP
const fontSize = FONT_SIZES.TITLE

// Mới
const pageWidth = PDF_PAGE_DIMENSIONS.A4.PORTRAIT.WIDTH
const margin = PDF_MARGINS.TOP
const fontSize = PDF_FONT_SIZES.DOCUMENT_TITLE
```

## ⚠️ **Breaking Changes**

1. **Tất cả constants đều có prefix `PDF_`**
2. **Một số tên đã thay đổi để rõ ràng hơn**
3. **Cấu trúc nested đã được tối ưu**
4. **Loại bỏ constants Excel khỏi PDF constants**

## 🔧 **Migration Steps**

1. **Cập nhật imports** trong tất cả files sử dụng PDF constants
2. **Thay đổi tên constants** theo mapping table
3. **Test** để đảm bảo không có lỗi
4. **Xóa** file constants cũ sau khi migration xong

## 📁 **File Structure mới**

```
src/composables/print/constants/
├── pdf/
│   ├── index.ts          # Barrel export
│   ├── layout.ts         # Page dimensions, margins, spacing
│   ├── typography.ts     # Font sizes, weights, alignment
│   ├── styling.ts        # Colors, borders, table styles
│   ├── formatting.ts     # File formats, orientations
│   ├── rendering.ts      # Canvas, image, text rendering
│   └── MIGRATION_GUIDE.md
├── excel/                # Excel constants (riêng biệt)
└── shared/               # Constants dùng chung (nếu có)
```
