# Contributing to Raadraac

Thank you for your interest in contributing to Raadraac! This guide will help you get started with contributing to the project.

## Development Setup

1. Fork the repository on GitHub
2. Clone your fork to your local machine
3. Install dependencies with `npm install`
4. Start the development server with `npm run dev`

## Development Workflow

1. Create a new branch for your feature or bugfix
2. Make your changes
3. Test your changes thoroughly
4. Commit your changes with a clear and descriptive commit message
5. Push your changes to your fork
6. Create a pull request to the main repository

## Coding Standards

- Follow the existing code style
- Use TypeScript for type safety
- Use Vue 3 Composition API for new components
- Write clean, readable code with appropriate comments
- Keep components small and focused on a single responsibility

## Adding New Features

When adding new features to Raadraac, please consider:

1. **Cultural Accuracy**: Ensure that any cultural information is accurate and respectful
2. **Performance**: The app should work well on mobile devices and with limited connectivity
3. **Accessibility**: All features should be accessible to all users
4. **Internationalization**: All text should support both English and Somali languages

## Adding New Objects

To add new Somali cultural objects to the database:

1. Add the object to `src/stores/objectStore.ts`
2. Include all required fields (id, nameEn, nameSo, material, traditionalUse, culturalInsight)
3. Optional fields can be added as needed (region, pronunciation, proverb, imageUrl)
4. If you have images, please ensure you have the rights to use them

## Reporting Issues

If you find a bug or have a suggestion, please create an issue on GitHub with:

1. A clear title and description
2. Steps to reproduce the issue
3. Expected and actual behavior
4. Screenshots if applicable
5. Any relevant code snippets

## Pull Request Process

1. Update the README.md with details of changes if needed
2. The PR should work in all supported browsers
3. Your PR will be reviewed by maintainers who may request changes
4. Once approved, your PR will be merged

## License

By contributing to Raadraac, you agree that your contributions will be licensed under the project's MIT License.
