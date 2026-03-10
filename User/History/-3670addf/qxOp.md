# 🎲 Fake Data Generator - Chrome Extension

A powerful Chrome extension for generating fake/mock data directly in your browser. Perfect for developers, testers, and anyone who needs to quickly fill forms with realistic test data.

## ✨ Features

- **🎯 Quick Data Generation**: Generate various types of fake data with one click
- **📝 Form Auto-Fill**: Automatically detect and fill form fields
- **🖱️ Context Menu**: Right-click on any input field for quick access
- **📋 Copy to Clipboard**: Easily copy generated data
- **🎨 Beautiful UI**: Modern, dark-themed popup interface
- **⚡ Lightweight**: No external API calls, all data generated locally

## 📦 Supported Data Types

| Category | Data Types |
|----------|------------|
| **Personal** | Full Name, First Name, Last Name |
| **Contact** | Email, Phone, Address, City, Country, Zip Code |
| **Business** | Company, Job Title |
| **Security** | Username, Password, Credit Card |
| **Misc** | Date, UUID, Lorem Ipsum |

## 🚀 Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd generate-data-extension
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the extension**
   ```bash
   pnpm build:extension
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder

### Adding Icons

Before building, add your extension icons to `public/icons/`:
- `icon-16.png` (16x16 pixels)
- `icon-32.png` (32x32 pixels)
- `icon-48.png` (48x48 pixels)
- `icon-128.png` (128x128 pixels)

## 🛠️ Development

### Available Scripts

```bash
# Start development server (for popup preview)
pnpm dev

# Build for production
pnpm build

# Build extension with all assets
pnpm build:extension

# Type checking
pnpm type-check

# Lint and fix
pnpm lint

# Format code
pnpm format
```

### Project Structure

```
generate-data-extension/
├── public/
│   └── icons/              # Extension icons
├── src/
│   ├── background/         # Service worker
│   │   └── index.ts
│   ├── content/            # Content scripts
│   │   ├── index.ts
│   │   └── styles.css
│   ├── popup/              # Popup UI (Vue 3)
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── PopupApp.vue
│   │   └── styles.css
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── fakeDataGenerator.ts
│   │   └── storage.ts
│   └── manifest.json       # Extension manifest
├── scripts/
│   └── build-extension.ts  # Build script
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎮 Usage

### Popup Interface
1. Click the extension icon in Chrome toolbar
2. Select a category (Personal, Contact, Business, etc.)
3. Click on a data type button to generate
4. Click the copy button to copy to clipboard

### Context Menu
1. Right-click on any input field
2. Select "Generate Fake Data"
3. Choose the type of data you need
4. Data will be automatically filled

### Auto-Fill Form
1. Open the extension popup
2. Click the "⚡ Fill Form" button
3. All detected form fields will be filled automatically

## 🔧 Configuration

The extension stores settings in Chrome's sync storage:

- **Locale**: Language preference (en/vi)
- **Show Floating Button**: Toggle floating quick-access button
- **Auto Detect Fields**: Enable/disable smart field detection
- **Favorites**: Quick access to frequently used data types

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- Styled with custom CSS (Cyberpunk-inspired theme)
- Icons: Emoji-based for simplicity

---

Made with ❤️ by Ahasoft
