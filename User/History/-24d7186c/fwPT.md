# 📋 Review chi tiết usePdfText.ts

## 🔍 **Đánh giá tổng quan**

### ✅ **Điểm mạnh:**
- ✅ Đúng pattern Vue Composable
- ✅ TypeScript typing đầy đủ
- ✅ JSDoc comments với ví dụ
- ✅ Error handling đúng cách
- ✅ Sử dụng constants từ file riêng
- ✅ Single responsibility (chỉ xử lý text)

### ❌ **Vấn đề nghiêm trọng:**

## 1. **Magic Numbers - Hardcode**
```typescript
// ❌ HIỆN TẠI
return context.headerEndPosition + 10
if (yPosition > context.headerEndPosition + 50)

// ✅ NÊN SỬA
const TEXT_SECTION_SPACING = 10
const MIN_TEXT_SPACE_FROM_HEADER = 50

return context.headerEndPosition + TEXT_SECTION_SPACING  
if (yPosition > context.headerEndPosition + MIN_TEXT_SPACE_FROM_HEADER)
```

## 2. **Hàm `processTextElement` quá dài và phức tạp**

### ❌ **Vấn đề:**
- 30+ dòng code
- Làm 4 việc cùng lúc: tính toán, page break, render, positioning
- 7 parameters
- Nested if statements

### ✅ **Giải pháp: Tách thành các hàm nhỏ**

```typescript
// ❌ HIỆN TẠI: Một hàm làm tất cả
const processTextElement = (
  pdf: jsPDF,
  text: string,
  currentY: number,
  maxWidth: number, 
  pageHeight: number,
  config: Required<PdfConfig>,
  context: PdfProcessingContext,
): number => {
  // 30+ dòng code phức tạp
}

// ✅ ĐỀ XUẤT: Tách thành nhiều hàm nhỏ
interface TextRenderOptions {
  pdf: jsPDF
  text: string
  maxWidth: number
  config: Required<PdfConfig>
  context: PdfProcessingContext
}

const calculateTextMetrics = (pdf: jsPDF, text: string, maxWidth: number) => {
  const lines = pdf.splitTextToSize(text, maxWidth)
  const requiredHeight = lines.length * SPACING.TEXT.LINE_HEIGHT
  return { lines, requiredHeight }
}

const shouldBreakPage = (
  currentY: number, 
  requiredHeight: number, 
  pageHeight: number,
  headerEndPosition: number
): boolean => {
  const availableHeight = pageHeight - currentY - SPACING.MARGIN.BOTTOM
  return requiredHeight > availableHeight && currentY > headerEndPosition + MIN_TEXT_SPACE_FROM_HEADER
}

const renderTextLines = (options: TextRenderOptions, lines: string[], startY: number): number => {
  const { pdf, config, context } = options
  let yPosition = startY

  for (const line of lines) {
    if (shouldAddNewPage(yPosition, pdf.internal.pageSize.height)) {
      yPosition = addNewPage(pdf, config, context)
    }
    
    pdf.text(line, SPACING.MARGIN.LEFT, yPosition, { align: 'left' })
    yPosition += SPACING.TEXT.LINE_HEIGHT
  }
  
  return yPosition
}

// Hàm chính giờ đây ngắn và dễ hiểu
const processTextElement = (options: TextRenderOptions, currentY: number): number => {
  const { pdf, text, maxWidth, config, context } = options
  const { lines, requiredHeight } = calculateTextMetrics(pdf, text, maxWidth)
  
  let yPosition = currentY
  
  if (shouldBreakPage(yPosition, requiredHeight, pdf.internal.pageSize.height, context.headerEndPosition)) {
    yPosition = addNewPage(pdf, config, context)
  }
  
  return renderTextLines(options, lines, yPosition)
}
```

## 3. **Parameter Hell - Quá nhiều parameters**

```typescript
// ❌ HIỆN TẠI: 7 parameters
const processTextElement = (
  pdf: jsPDF,
  text: string,
  currentY: number,
  maxWidth: number,
  pageHeight: number,
  config: Required<PdfConfig>,
  context: PdfProcessingContext,
): number

// ✅ ĐỀ XUẤT: Group thành interface
interface TextProcessingOptions {
  pdf: jsPDF
  text: string
  currentY: number
  maxWidth: number
  pageHeight: number
  config: Required<PdfConfig>
  context: PdfProcessingContext
}

const processTextElement = (options: TextProcessingOptions): number => {
  // Code sạch hơn nhiều
}
```

## 4. **Tách Page Management Logic**

```typescript
// ✅ ĐỀ XUẤT: Tạo composable riêng cho page management
// usePdfPageManager.ts
export const usePdfPageManager = () => {
  const addNewPageWithHeader = (
    pdf: jsPDF, 
    config: Required<PdfConfig>, 
    context: PdfProcessingContext
  ): number => {
    pdf.addPage()
    const pageNumber = pdf.getNumberOfPages()
    
    if (!context.pagesWithHeaders.has(pageNumber)) {
      addHeader(pdf, config, SPACING.MARGIN.TOP)
      context.pagesWithHeaders.add(pageNumber)
    }
    
    return context.headerEndPosition + TEXT_SECTION_SPACING
  }
  
  const needsPageBreak = (
    currentY: number,
    requiredHeight: number,
    availableHeight: number,
    minSpaceFromHeader: number
  ): boolean => {
    return requiredHeight > availableHeight && 
           currentY > minSpaceFromHeader
  }
  
  return {
    addNewPageWithHeader,
    needsPageBreak
  }
}
```

## 5. **Constants cần thêm**

```typescript
// constants/text.ts
export const TEXT_CONSTANTS = {
  SPACING: {
    AFTER_HEADER: 10,
    MIN_FROM_HEADER: 50,
    BETWEEN_ELEMENTS: 5,
  },
  ALIGNMENT: {
    DEFAULT: 'left' as const,
  }
} as const
```

## 🎯 **Kết luận**

### **Điểm số đánh giá:**
- **Chuẩn Vue Pattern**: 8/10 ✅
- **Maintainability**: 6/10 ⚠️ (do hàm phức tạp)  
- **Readability**: 6/10 ⚠️ (do logic lồng nhau)
- **Performance**: 7/10 ✅
- **Type Safety**: 9/10 ✅
- **Error Handling**: 8/10 ✅

### **Ưu tiên khắc phục:**
1. **🔥 Cao**: Tách hàm `processTextElement` 
2. **🔥 Cao**: Thay magic numbers
3. **⚠️ Trung bình**: Giảm parameters bằng interface
4. **⚠️ Trung bình**: Tách page management logic

### **Sau khi cải thiện:**
- Code dễ đọc và maintain hơn
- Dễ unit test từng function nhỏ
- Dễ mở rộng thêm tính năng
- Giảm coupling giữa các phần
