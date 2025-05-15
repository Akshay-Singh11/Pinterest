# Contributing to Pinterest Clone

Thank you for your interest in contributing to the Pinterest Clone project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:

1. A clear, descriptive title
2. Steps to reproduce the bug
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details (browser, OS, etc.)

### Suggesting Features

We welcome feature suggestions! When suggesting a feature:

1. Check if the feature has already been suggested
2. Provide a clear description of the feature
3. Explain why this feature would be beneficial
4. Include any relevant examples or mockups

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Test your changes thoroughly
5. Submit a pull request

#### Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation if necessary
3. Include a clear description of the changes
4. Link any related issues

## Development Setup

Follow the [INSTALLATION.md](./INSTALLATION.md) guide to set up your development environment.

## Project Structure

```
project/
├── public/
├── src/
│   ├── components/         # UI components
│   ├── context/            # React context providers
│   ├── data/               # Sample data
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Coding Standards

### General Guidelines

- Use TypeScript for type safety
- Follow the existing code style
- Write clear, descriptive variable and function names
- Keep components small and focused
- Use functional components with hooks

### Component Structure

- Each component should be in its own file
- Use named exports for components
- Memoize components when appropriate
- Use proper prop typing

Example:

```tsx
import React, { memo } from 'react';

interface MyComponentProps {
  title: string;
  onClick: () => void;
}

function MyComponentBase({ title, onClick }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onClick}>Click me</button>
    </div>
  );
}

const MyComponent = memo(MyComponentBase);
MyComponent.displayName = 'MyComponent';

export default MyComponent;
```

### Styling

- Use Tailwind CSS for styling
- Follow the existing color scheme and design patterns
- Use the theme utilities for consistent theming

### State Management

- Use React Context for global state
- Use local state for component-specific state
- Prefer `useReducer` for complex state logic

## Performance Considerations

- Memoize expensive calculations
- Use virtualization for long lists
- Optimize image loading
- Debounce event handlers when appropriate

## Testing

If you add new features, please include tests. We use:

- Jest for unit testing
- React Testing Library for component testing

## Documentation

- Update the README.md if you add or change features
- Document complex functions and components
- Include JSDoc comments for public APIs

## Git Workflow

1. Create a branch for your feature or bugfix
2. Make small, focused commits
3. Push your branch to your fork
4. Create a pull request to the main repository

### Branch Naming

- Feature branches: `feature/your-feature-name`
- Bug fix branches: `fix/issue-description`
- Documentation branches: `docs/what-you-documented`

### Commit Messages

Write clear, concise commit messages that explain what the commit does:

```
feat: add user avatar component

- Create UserAvatar component
- Add size variants
- Implement name display option
```

## Questions?

If you have any questions about contributing, please open an issue with your question.

Thank you for contributing to the Pinterest Clone project!
