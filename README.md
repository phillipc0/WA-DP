# Developer Portfolio

A modern full-stack web application to create and customize your personal developer portfolio. Built in TypeScript with React and Next.js.

## Deadlines

- ✅Important Functionalities (FE/BE Split & CV): 06.07.2025
- Feature Complete (at-least medium & high): 10.08.2025
- In-depth Documentation: 22.08.2025

## Features

- Personal information management with avatar and social links
- Skills showcase with proficiency levels
- GitHub integration for repository display
- CV builder with work experience and education
- Dark/light theme support
- JWT-based authentication
- Real-time editing with unsaved changes detection

## Tech Stack

### Frontend

- React 19 with TypeScript
- Vite for development
- HeroUI component library
- Tailwind CSS for styling
- Framer Motion for animations

### Backend

- Next.js 15 with API routes
- JWT authentication with bcryptjs
- JSON file-based data storage

## Pipeline

This project includes a CI/CD pipeline powered by GitHub Actions.

Checks for every push on a pull request or the the main branch:

- Linting & Formatting using ESLint
- Lines of code are measured
- Unit tests using Vitest including coverage (>80%)
- E2E tests using Cypress
- Lighthouse report (>80%)
- SonarCloud static code analysis (A-Marks)
- On the main branch: Website is deployed

The dependencies between the pipelines are as follows:
<img width="978" alt="image" src="https://github.com/user-attachments/assets/531eca22-d38a-4681-b5ce-9402d1e23c38" />

The pipeline configuration is located in `.github/workflows/test-build-deploy.yml`.

## Installation

Install all dependencies:

```bash
npm run install-dev
```

Start development servers:

```bash
npm run dev
```

The app will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Development Scripts

```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Frontend only (port 5173)
npm run dev:backend      # Backend only (port 3000)
npm run test             # Run unit tests
npm run test:cov         # Run tests with coverage
npm run e2e:open         # Open Cypress test runner
npm run build            # Build for production
npm run lint             # Lint and fix code
```

## Project Structure

```
src/                     # Frontend React application
backend/                 # Next.js API routes and backend logic
tests/                   # Unit tests with Vitest
cypress/                 # E2E tests with Cucumber
```

## Configuration

- Path aliases: `@/*` maps to `./src/*`
- API proxy: Frontend proxies `/api/*` to backend on port 3000
- Authentication: JWT tokens stored in secure cookies
- Data storage: JSON files for users and portfolio data

## Testing

- Unit tests: Vitest
- E2E tests: Cypress with Cucumber/Gherkin
- Coverage reports available with `npm run test:cov`

## Contributing

We welcome contributions to the Developer Portfolio project! Please follow these guidelines to ensure a smooth contribution process.

### Prerequisites

- Node.js 18+ installed
- Git installed and configured
- Basic knowledge of React, TypeScript, and Next.js

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/WA-DP.git
   cd WA-DP
   ```

3. **Install dependencies**:

   ```bash
   npm run install-dev
   ```

4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. **Start the development servers** (see Installation section above)
2. **Make your changes** following the existing code style and patterns
3. **Test your changes** using the development scripts above
4. **Commit your changes** with descriptive messages

### Code Standards

- **TypeScript**: All new code should be written in TypeScript
- **Testing**: Aim for >80% test coverage for new features
- **Linting**: Code must pass ESLint checks (`npm run lint`)
- **Components**: Use HeroUI components and follow existing patterns
- **Styling**: Use Tailwind CSS classes consistently

### Pull Request Process

1. **Push your branch** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:

   - Clear title and description
   - Reference to any related issues
   - Screenshots for UI changes

3. **Wait for review** - all PRs require review and passing CI checks

### CI/CD Pipeline

Your PR will automatically run through our pipeline:

- ✅ ESLint checks
- ✅ Unit tests with coverage >80%
- ✅ E2E tests
- ✅ Lighthouse performance >80%
- ✅ SonarCloud analysis

### Architecture Notes

When contributing, be aware of the dual-server architecture (see Project Structure section above).

### Common Contribution Areas

- **Bug fixes**: Check existing issues for bugs to fix
- **New features**: Discuss major features in issues first
- **Documentation**: Improve code comments and README
- **Testing**: Add tests for existing untested code
- **Performance**: Optimize components and API calls

### Generate dependency graph

Madge is included to visualize module dependencies and compute simple metrics. Run the following command to generate an
SVG graph and metrics file under `docs/`:

```bash
npm run deps:madge
```

This creates `docs/dependency-graph.svg` and `docs/dependency-metrics.json` with coupling and cohesion values for each
module.
The generated files are excluded from version control via `.gitignore`.
Make sure [Graphviz](https://graphviz.org/download/) is installed locally so Madge can create the SVG image.

## SonarQube Setup

This project includes SonarQube integration for code quality analysis and coverage reporting.

### Local SonarQube Server

1. **Start SonarQube locally using Docker:**

   ```bash
   docker-compose -f docker-compose.sonar.yml up -d
   ```

2. **Access SonarQube:**

   - Open http://localhost:9000 in your browser
   - Login with default credentials: `admin/admin`
   - Change password when prompted

3. **Generate Authentication Token:**

   - Go to: User → My Account → Security → Generate Tokens
   - Enter a name and select "User Token" in the dropdown then click "Generate"
   - Copy the generated token

4. **Configure Authentication:**

   ```bash
   # Copy the template file for local development
   cp sonar-project-local.properties.template sonar-project-local.properties

   # Edit sonar-project-local.properties and replace "your-token-here" with your actual token
   ```

### Running SonarQube Analysis

```bash
# Run analysis only
npm run sonar

# Run tests with coverage + analysis
npm run sonar:coverage
```

### Stop SonarQube

```bash
docker-compose -f docker-compose.sonar.yml down
```

## License

Licensed under the [MIT license](LICENSE).
