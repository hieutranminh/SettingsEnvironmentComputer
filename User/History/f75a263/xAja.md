# HTML Parser Improvements

## Issues Found

### 1. Hardcode và thiếu flexibility

- Regex patterns được hardcode
- Chỉ support một số HTML tags cố định
- Không có cách để extend thêm tags mới

### 2. Inconsistency trong tag support

- `parseHtmlToRichText`: support 4 tags
- `splitByBoldTags`: chỉ support `<b>` tag
- `stripHtmlTags`: support tất cả HTML tags

### 3. Performance issues

- Regex được tạo mới mỗi lần gọi
- Multiple regex operations không cần thiết

### 4. Logic phức tạp

- `parseHtmlToRichText` quá dài (40 lines)
- While loop có thể gây infinite loop
- Nested logic khó follow

## Proposed Solutions

### 1. Tạo HTML Tag Registry

```typescript
interface HtmlTagConfig {
  openTags: string[]
  closeTags: string[]
  formatType: 'bold' | 'italic' | 'underline'
}

const HTML_TAG_REGISTRY: Record<string, HtmlTagConfig> = {
  bold: { openTags: ['<b>', '<strong>'], closeTags: ['</b>', '</strong>'], formatType: 'bold' },
  italic: { openTags: ['<i>', '<em>'], closeTags: ['</i>', '</em>'], formatType: 'italic' },
}
```

### 2. Tách logic parsing

```typescript
// Tách thành các functions nhỏ hơn
const parseHtmlTags = (htmlString: string) => {
  /* ... */
}
const buildRichTextParts = (parsedTags: ParsedTag[]) => {
  /* ... */
}
const validateHtmlStructure = (htmlString: string) => {
  /* ... */
}
```

### 3. Cải thiện performance

```typescript
// Cache regex patterns
const HTML_TAG_REGEX = /<(\/?)(b|i|strong|em)>/gi

// Sử dụng matchAll thay vì while loop
const matches = Array.from(htmlString.matchAll(HTML_TAG_REGEX))
```

### 4. Unified tag support

```typescript
// Tất cả functions đều sử dụng cùng tag registry
const getSupportedTags = () => Object.keys(HTML_TAG_REGISTRY)
const isTagSupported = (tag: string) => /* ... */
```

### 5. Better error handling

```typescript
interface ParseResult {
  success: boolean
  data?: HtmlToExcelResult
  error?: string
}
```

## Priority

1. **High**: Fix hardcode và inconsistency
2. **Medium**: Improve performance và error handling
3. **Low**: Refactor complex logic
