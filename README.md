# Raadraac - Somali Cultural Object Recognition App

Raadraac is a Progressive Web App (PWA) designed to identify and provide information about traditional Somali objects. Using image recognition technology, the app helps preserve and share Somali cultural heritage.

## Features

- **Image Recognition**: Upload images or take photos of traditional Somali objects
- **Cultural Information**: Learn about the object's name, materials, traditional uses, and cultural significance
- **Bilingual Support**: Full support for both Somali and English languages
- **Offline Mode**: Works without an internet connection
- **Progressive Web App**: Install on mobile devices for a native-like experience

## Tech Stack

- Vue 3 + Composition API
- TypeScript
- Tailwind CSS
- TensorFlow.js for image recognition
- Dexie.js for offline database support
- Vue Router for navigation
- Vue i18n for internationalization
- Vite + PWA plugin for building

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/raadraac.git
cd raadraac
```

2. Install dependencies:

```
npm install
```

3. Run the development server:

```
npm run dev
```

4. Build for production:

```
npm run build
```

## Project Structure

- `src/components/` - Reusable Vue components
- `src/views/` - Page components
- `src/stores/` - Pinia stores for state management
- `src/services/` - Services for TensorFlow and database
- `src/composables/` - Composable functions
- `src/locales/` - Translation files
- `src/router/` - Vue Router configuration
- `src/i18n/` - i18n configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
