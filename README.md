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

## License

Licensed under the [MIT license](LICENSE).
