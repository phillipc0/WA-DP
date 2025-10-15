# Contributing

We welcome any contributions to the Developer Portfolio project. Please follow these guidelines to ensure a smooth contribution process.

## Prerequisites

- Node.js 18+ installed
- Git installed and configured
- Basic knowledge of React, TypeScript, and Next.js

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/WA-DP.git
   cd WA-DP
   ```

3. **Install dependencies**:

   ```bash
   npm run install-dev
   ```

4. **Create a branch**:
   ```bash
   git checkout -b your-feature-name
   ```

### Development Workflow

1. Start the development servers (see README)
2. Make your changes following the existing code style and patterns
3. Test your changes using the scripts listed in the "Development Scripts" section of the README
4. Commit your changes with descriptive messages
5. Update the version in the package.json manually or using:
   - `npm version patch` for small fixes, updated docs, updated dependencies
   - `npm version minor` for small changes or features
   - `npm version major` for large, important or breaking changes or features

### Code Standards

- TypeScript: All new code should be written in TypeScript
- Testing: Aim for >80% test coverage for new features
- Linting: Code must pass ESLint checks
- Components: Use HeroUI components and follow existing patterns
- Styling: Use Tailwind CSS classes consistently

### Pull Request Process

1. Push your branch to your fork:

   ```bash
   git push origin your-feature-name
   ```

2. Create an Issue in this GitHub Repo with:

- Clear title and description
- Screenshots for UI changes

3. Create a Pull Request on GitHub and:

- Link it to the Issue
- Complete the checklist in the pull request description

4. Wait for review - all PRs require review and passing CI checks

### CI/CD Pipeline

Your PR will automatically run through our pipeline including:

- ESLint checks
- Unit tests
- E2E tests
- Lighthouse performance >80%
- SonarCloud analysis

### Common Contribution Areas

- **Bug fixes**: Check existing issues for bugs to fix
- **New features**: Discuss major features in issues first
- **Documentation**: Improve code comments and README
- **Testing**: Add tests for existing untested code
- **Performance**: Optimize components and API calls
