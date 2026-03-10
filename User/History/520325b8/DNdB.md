# Vue Cursor AI - Professional Vue 3.5 Boilerplate

From 02_testtttt

A professional Vue 3.5 boilerplate with TypeScript, Vite, and modern tooling for building scalable applications.

## 🚀 Features

- **Vue 3.5** with Composition API and TypeScript
- **Vite** for fast development and building
- **Pinia** for state management
- **Vue Router** with lazy loading
- **Vue I18n** for internationalization (English & Korean)
- **Axios** with interceptors for HTTP requests
- **Day.js** with timezone support
- **SCSS** with global imports and utility functions
- **ESLint + Prettier** for code quality
- **Professional folder structure**
- **TypeScript** throughout the project

## 📦 Tech Stack

- **Framework**: Vue 3.5
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.x
- **State Management**: Pinia 2.x
- **Routing**: Vue Router 4.x
- **Internationalization**: Vue I18n 9.x
- **HTTP Client**: Axios 1.x
- **Date/Time**: Day.js 1.x
- **Styling**: SCSS
- **Linting**: ESLint + Prettier

## 🏗️ Project Structure

```
vue-cursor-ai/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable Vue components
│   ├── constants/          # Constants, enums, and config
│   ├── locales/            # i18n language files
│   │   ├── en.json         # English translations
│   │   └── ko.json         # Korean translations
│   ├── plugins/            # Vue plugins
│   │   ├── i18n.ts         # i18n configuration
│   │   └── dayjs.ts        # Day.js configuration
│   ├── router/             # Vue Router configuration
│   │   └── index.ts        # Main router setup
│   ├── services/           # API services
│   │   └── axios.ts        # Axios configuration
│   ├── store/              # Pinia stores
│   │   ├── counter.ts      # Example counter store
│   │   └── index.ts        # Store exports
│   ├── styles/             # Global styles
│   │   ├── variables.scss  # SCSS variables
│   │   ├── mixins.scss     # SCSS mixins
│   │   ├── functions.scss  # SCSS functions
│   │   └── main.scss       # Main stylesheet
│   ├── utils/              # Utility functions
│   │   └── index.ts        # Common utilities
│   ├── views/              # Page components
│   │   ├── Home.vue        # Home page
│   │   ├── About.vue       # About page
│   │   └── NotFound.vue    # 404 page
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
├── .eslintrc.cjs           # ESLint configuration
├── .prettierrc             # Prettier configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vue-cursor-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🌍 Internationalization

The project supports English (en) and Korean (ko) languages with automatic language detection:

- **Browser Language**: Automatically detects browser language
- **Local Storage**: Remembers user's language preference
- **Manual Switching**: Language switcher in the header

### Adding New Languages

1. Create a new language file in `src/locales/` (e.g., `fr.json`)
2. Add the language to the `SUPPORTED_LANGUAGES` constant in `src/constants/index.ts`
3. Update the timezone configuration if needed

## 🎨 Styling

The project uses SCSS with a comprehensive design system:

- **Variables**: Colors, spacing, typography, breakpoints
- **Mixins**: Responsive design, flexbox utilities, animations
- **Functions**: Color manipulation, spacing calculations
- **Global Imports**: Automatically imported in all `.vue` files

### Using SCSS Variables

```scss
.my-component {
  color: $primary-color;
  padding: $spacing-md;
  border-radius: $border-radius-lg;

  @include mobile {
    padding: $spacing-sm;
  }
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=Vue Cursor AI
```

### TypeScript Configuration

The project includes strict TypeScript configuration with:

- Path aliases (`@` points to `src/`)
- Strict type checking
- Modern ES features support

### ESLint & Prettier

Pre-configured with Vue 3 and TypeScript rules:

- Vue 3 specific rules
- TypeScript integration
- Prettier formatting
- Consistent code style

## 📱 Features

### State Management (Pinia)

Example store usage:

```typescript
import { useCounterStore } from '@/store/counter'

const counterStore = useCounterStore()
counterStore.increment()
```

### HTTP Client (Axios)

Pre-configured with interceptors:

```typescript
import { apiService } from '@/services/axios'

// GET request
const response = await apiService.get('/api/users')

// POST request
const newUser = await apiService.post('/api/users', userData)
```

### Date/Time (Day.js)

Configured with timezone support:

```typescript
import dayjs from '@/plugins/dayjs'

// Format with timezone
const formatted = dayjs().format('YYYY-MM-DD HH:mm:ss')
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment-Specific Builds

- Development: `npm run dev`
- Production: `npm run build`
- Preview: `npm run preview`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔄 Updates

To update dependencies:

```bash
npm update
```

For major version updates, check the migration guides for each package.

---

**Happy coding! 🎉**
