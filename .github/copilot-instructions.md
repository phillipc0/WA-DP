# WA-DP (Developer Portfolio) Instructions

Always follow these instructions first and fallback to additional search and context gathering only if the information provided here is incomplete or found to be in error.

## Project Overview

WA-DP is a React/TypeScript developer portfolio application with a Next.js backend API. The application allows users to create, customize, and manage their developer portfolios through a web interface.

**Architecture:**

- **Frontend**: React 19.1.0 + TypeScript + Vite (development server on port 5173)
- **Backend**: Next.js 15.3.3 API (development server on port 3000)
- **Testing**: Vitest (unit tests), Cypress (E2E tests)
- **UI Framework**: HeroUI components + Tailwind CSS
- **Build Tool**: Vite with TypeScript compilation

## Working Effectively

### Bootstrap and Install Dependencies

```bash
# Frontend dependencies (includes concurrently, testing tools, etc.)
npm ci  # Takes ~10s, may take up to 2 minutes. NEVER CANCEL.

# Backend dependencies
cd backend && npm ci  # Takes ~7s

# OR use the combined installer (requires frontend deps to be installed first)
npm run install-dev  # Installs both frontend and backend concurrently
```

**IMPORTANT**: Cypress binary download often fails due to network restrictions. If `npm ci` fails with Cypress download errors, use:

```bash
CYPRESS_INSTALL_BINARY=0 npm ci  # Skip Cypress binary, install other deps
```

### Build and Test

```bash
# Build the application
npm run build  # Takes ~14s. NEVER CANCEL. Set timeout to 60+ seconds.

# Run unit tests (424 tests across 24 files)
npm run test     # Takes ~22s. NEVER CANCEL. Set timeout to 60+ seconds.
npm run test:cov # Takes ~24s with coverage report (>94% coverage). NEVER CANCEL.

# Linting and formatting
npm run lint   # Takes ~3s. Must pass or CI will fail.
npm run format # Takes ~2s. Formats all code with Prettier.
```

### Development Servers

```bash
# Start both frontend and backend servers concurrently
npm run dev  # Frontend: http://localhost:5173, Backend: http://localhost:3000

# Start individually if needed
npm run dev:frontend  # Frontend only (port 5173)
npm run dev:backend   # Backend only (port 3000)
```

**Startup Time**: ~2s for servers to be ready. Both must be running for full functionality.

### E2E Testing

```bash
# Cypress E2E tests (requires both servers running)
npm run e2e:open  # Opens Cypress Test Runner GUI
npm run e2e:run   # Runs E2E tests headlessly (takes ~1.5 minutes)
```

**CRITICAL**: Cypress binary often fails to download due to network restrictions. E2E tests require manual installation:

```bash
npx cypress install  # May fail with "ENOTFOUND download.cypress.io"
```

If Cypress fails to install, document this limitation but proceed with other testing.

## Validation Scenarios

**ALWAYS** test these scenarios after making changes:

### Basic Application Functionality

1. **Start Development Servers**:

   ```bash
   npm run dev
   # Wait for both servers to show "ready" status
   ```

2. **Verify Frontend**: Visit http://localhost:5173

   - Portfolio displays with default user "John Doe"
   - Skills section shows progress bars
   - Work Experience and Education sections are visible
   - GitHub repositories section (may show "Failed to load" - this is normal in sandboxed environment)

3. **Verify Backend API**: Test API endpoint

   ```bash
   curl -s http://localhost:3000/api/portfolio
   # Should return: {"error":"Method not allowed"} (correct for GET request)
   ```

4. **Test User Authentication**:
   - Click "Login" button
   - Modal appears with "Create Admin Account" form
   - Enter username: `admin`, password: `password123`
   - Click "Create" - should redirect to `/edit` page
   - Portfolio editor loads with tabs: Basic Information, Social Links, Skills, Work Experience, Education

### Build and CI Validation

**ALWAYS** run these commands before committing:

```bash
npm run build     # Must succeed
npm run lint      # Must pass with no errors
npm run test:cov  # Must pass all 424 tests with >80% coverage
```

## CI/CD Pipeline Timing Expectations

The GitHub Actions pipeline has these timing expectations:

| Job                   | Expected Time | Timeout | Critical Notes                     |
| --------------------- | ------------- | ------- | ---------------------------------- |
| Lint Codebase         | ~34s          | 5 min   | Must pass or PR fails              |
| Check Formatting      | ~1m 7s        | 10 min  | Must pass or PR fails              |
| Unit Tests & Coverage | ~54s          | 15 min  | Must maintain >80% coverage        |
| E2E Tests             | ~1m 28s       | 20 min  | May fail if Cypress install issues |
| Lighthouse Report     | ~1m 44s       | 15 min  | Must score >80% in all categories  |
| Build and Deploy      | ~1m 47s       | 20 min  | Only runs on main branch           |
| SonarCloud Analysis   | ~56s          | 10 min  | Requires SONAR_TOKEN               |

**NEVER CANCEL** any of these operations. Build times can vary significantly in CI environment.

## Project Structure

```
src/                           # Frontend React application
├── components/               # React components
│   ├── portfolio/           # Public portfolio display components
│   └── portfolioEditor/     # Portfolio editing components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries and business logic
├── pages/                   # Page components (index.tsx, edit.tsx)
└── types/                   # TypeScript type definitions

backend/                      # Next.js API backend
├── lib/                     # Backend utilities (auth, userService)
├── pages/api/               # API endpoints (/api/portfolio, /api/users, etc.)
└── frontend/                # Built frontend files (populated during build)

tests/                        # Vitest unit tests
└── components/              # Component tests organized by feature

cypress/                      # Cypress E2E tests
├── e2e/                     # Feature files (.feature format with Gherkin)
└── support/                 # Test support files and step definitions
```

## Common Commands and Tasks

### Dependency Management

```bash
npm run install-dev     # Install all dependencies (frontend + backend)
npm audit              # Check for vulnerabilities
npm run deps:madge      # Generate dependency graph (requires graphviz)
```

### Code Quality

```bash
npm run lint           # ESLint check and auto-fix
npm run format         # Prettier formatting
npm run check-all      # Build + lint + format (convenience command)
```

### SonarQube Analysis (Local)

```bash
# Start SonarQube server (requires Docker)
docker-compose -f docker-compose.sonar.yml up -d

# Run analysis (requires token configuration)
npm run sonar                    # Analysis only
npm run sonar:coverage           # With test coverage

# Stop SonarQube
docker-compose -f docker-compose.sonar.yml down
```

### Testing

```bash
npm run test                    # Unit tests only
npm run test:cov                # Unit tests with coverage report
npm run e2e:open               # Interactive Cypress runner
npm run e2e:run                # Headless E2E tests
```

## Important Files and Locations

### Configuration Files

- `package.json` - Frontend dependencies and scripts
- `backend/package.json` - Backend dependencies
- `vite.config.ts` - Build configuration and dev server proxy
- `vitest.config.ts` - Test configuration and coverage settings
- `cypress.config.ts` - E2E test configuration
- `eslint.config.js` - Linting rules
- `tailwind.config.js` - CSS framework configuration

### Key Source Files

- `src/lib/use-portfolio-editor.ts` - Main portfolio editing logic
- `src/components/portfolioEditor/index.tsx` - Portfolio editor UI
- `backend/pages/api/portfolio.ts` - Portfolio data API
- `backend/pages/api/users.ts` - User management API
- `backend/lib/auth.ts` - Authentication utilities

### Build Outputs

- `dist/` - Frontend build output
- `backend/.next/` - Backend build output
- `coverage/` - Test coverage reports

## Known Issues and Workarounds

### Cypress Installation

Cypress binary download frequently fails due to network restrictions:

```
Error: getaddrinfo ENOTFOUND download.cypress.io
```

**Workaround**: Use `CYPRESS_INSTALL_BINARY=0 npm ci` to skip Cypress binary during development.

### GitHub API Limitations

In sandboxed environments, GitHub API calls may fail:

- Portfolio displays "Failed to load GitHub repositories"
- This is expected behavior and does not affect core functionality

### Node.js Version

- Current environment: Node.js v20.19.4
- CI pipeline uses: Node.js v22.15
- Application works with both versions

## Troubleshooting

### Build Issues

1. **TypeScript errors**: Run `npm run build` to see compilation errors
2. **Missing dependencies**: Run `npm ci` and `cd backend && npm ci`
3. **Port conflicts**: Kill processes on ports 3000 and 5173

### Test Failures

1. **Unit test failures**: Check for breaking changes in components
2. **Coverage below 80%**: Add tests for new code or update thresholds in `vitest.config.ts`
3. **E2E test issues**: Ensure both servers are running with `npm run dev`

### Development Server Issues

1. **Frontend not loading**: Check port 5173 is available
2. **API calls failing**: Ensure backend is running on port 3000
3. **Hot reload not working**: Restart dev servers with `npm run dev`

## Validation Checklist

Before committing changes, ALWAYS verify:

- [ ] `npm run build` succeeds
- [ ] `npm run test:cov` passes all tests with >80% coverage
- [ ] `npm run lint` passes with no errors
- [ ] `npm run format` shows no changes needed
- [ ] `npm run dev` starts both servers successfully
- [ ] Portfolio displays correctly at http://localhost:5173
- [ ] Login/authentication flow works (create user, access `/edit`)
- [ ] No console errors in browser developer tools

These steps ensure your changes will pass the CI pipeline and maintain code quality standards.
