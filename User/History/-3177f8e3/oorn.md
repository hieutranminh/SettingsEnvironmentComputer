# Hướng dẫn khắc phục Go to Definition (Ctrl+Click) trong Vue 2

## Vấn đề

Ctrl+Click vào methods trong template Vue không navigate đến định nghĩa của hàm.

## Giải pháp

### Bước 1: Cài đặt Extension

Bạn cần cài đặt một trong các extension sau:

**Option 1: Volar (Khuyến nghị cho Vue 2 với compatibility mode)**

- Extension ID: `Vue.volar`
- Sau khi cài, đảm bảo bật "Vue: Take Over Mode" trong Command Palette (Ctrl+Shift+P)

**Option 2: Vetur (Cho Vue 2)**

- Extension ID: `octref.vetur`
- ⚠️ Lưu ý: Không nên dùng cùng lúc với Volar

### Bước 2: Reload Window

1. Nhấn `Ctrl+Shift+P`
2. Gõ "Reload Window"
3. Chọn "Developer: Reload Window"

### Bước 3: Kiểm tra Language Server

1. Mở Output panel: `Ctrl+Shift+U`
2. Chọn "Vue Language Server" hoặc "Vetur" từ dropdown
3. Xem có lỗi nào không

### Bước 4: Thử lại

- Ctrl+Click vào `onActionAddPayrollStatement` trong template (dòng 28)
- Hoặc Ctrl+Click vào bất kỳ method nào trong template

## Nếu vẫn không hoạt động

### Kiểm tra Extension đang dùng:

1. Mở Extensions (Ctrl+Shift+X)
2. Tìm "Vue" và xem extension nào đang được enable
3. Chỉ enable MỘT trong hai: Volar HOẶC Vetur

### Với Volar:

- Đảm bảo `volar.compatibilityMode` được set thành `true` (đã có trong settings.json)
- Đảm bảo `volar.takeOverMode.enabled` được set thành `true`

### Với Vetur:

- Đảm bảo Vetur được enable
- Disable Volar nếu đang dùng Vetur

## Lưu ý

- File `jsconfig.json` đã được cấu hình với path aliases đúng
- File `.vscode/settings.json` đã có các cấu hình cần thiết
- Nếu đổi extension, cần reload window lại
