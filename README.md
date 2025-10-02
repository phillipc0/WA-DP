# Developer Portfolio

A modern full-stack web application to create and customize your personal developer portfolio. Built in TypeScript with
React and Next.js.

**Contributing:** See [CONTRIBUTING.md](https://github.com/phillipc0/WA-DP/blob/main/CONTRIBUTING.md)

## Deadlines

- ✅ Important Functionalities (FE/BE Split & CV): 06.07.2025
- Feature Complete (at-least medium & high): 10.08.2025
- In-depth Documentation: 22.08.2025

## Features

- Personal information management with avatar and social links
- Skills showcase with proficiency levels
- GitHub integration for repository display
- CV builder with work experience and education
- AI-powered bio generation with Gemini
- API key management for AI services
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

## Installation for Users

This project is deployed as a Docker container, you will need Docker installed on your server.

1. **Pull the Docker Image**

   ```bash
   docker pull ghcr.io/phillipc0/wa-dp:latest
   ```

2. **Run the Docker Container**

   ```bash
   docker run -d --name wa-dp-container -p 3000:80 --restart always ghcr.io/phillipc0/wa-dp:latest
   ```

3. **Configure a Reverse Proxy (Nginx)**

   The Docker container opens the application on port `3000`. You need a web-server
   like Nginx as a reverse proxy. https://nginx.org/en/docs/beginners_guide.html

   **Here is an example Nginx configuration:**

   ```nginx
   server {
       listen 443 ssl;
       server_name wa-dp.your-domain.com;

        # SSL-certificate and keys etc...

       location / {
           proxy_pass http://127.0.0.1:3000;
       }

   }

   server {
       listen 80;
       server_name wa-dp.your-domain.com;
       return 301 https://$host$request_uri;

   }
   ```

## Update the Docker Container

You have two options for managing your portfolio data (`portfolio.json` and `users.json`), to persist manual updates
to the wa-dp-container:

**Option A: Manual Export/Import**

With this method, you use WA-DP's built-in export feature to back up your data before updating.

- **Before updating the container:**
  1. Log into WA-DP
  2. Go to the "Edit" page
  3. Use the **"Export Portfolio Data"** button to download your `portfolio-data.json`
- **After updating the container:**
  1. Log in again (you need to create a new admin user)
  2. Use the **"Import Portfolio Data"** button to upload your saved `portfolio-data.json`

**Option B: Using Docker Volumes (Recommended)**

This method persists your data on the host machine, throughout container updates automatically

- **First, create a directory on your server to store your data:**

  ```bash
  mkdir -p /path/on/your/server/wa-dp-data
  ```

- **Run the container with a volume:**
  Replace `/path/on/your/server/wa-dp-data` with the actual path you just created.
  ```bash
  docker run -d --name wa-dp-container -p 3000:80 --restart always \
    -v /path/on/your/server/wa-dp-data:/app/backend/data \
    ghcr.io/phillipc0/wa-dp:latest
  ```

Now, all updates to your portfolio and user data will be saved in the specified directory on your server.

### Performing the Update

1. **Pull the latest image from the registry, then stop and remove the old container:**

   ```bash
   docker pull ghcr.io/phillipc0/wa-dp:latest
   docker stop wa-dp-container
   docker rm wa-dp-container
   ```

2. **Start the new container:**

   Run the same `docker run` command you used initially, depending on whether you are using volumes or not.

3. **(Optional) Clean up old images:**

   After a few updates, you might have old, unused images. You can clean them up with:

   ```bash
   docker image prune -a --filter "label=org.opencontainers.image.source=https://github.com/phillipc0/WA-DP"
   ```

## Installation for Developers

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

### Development Scripts

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

## Pipeline

This project includes a CI/CD pipeline powered by GitHub Actions.

Checks for every push on a pull request or the the main branch:

- Linting & Formatting using ESLint
- Lines of code are measured
- Unit tests using Vitest including coverage (>80%)
- E2E tests using Cypress
- Lighthouse report (>80%)
- SonarCloud static code analysis (A-Marks)
- On the main branch: A new Docker image is built and pushed to the GitHub Container Registry

The dependencies between the pipelines are as follows:

<img width="420" alt="image" src="https://github.com/user-attachments/assets/531eca22-d38a-4681-b5ce-9402d1e23c38" />

The pipeline configuration is located in `.github/workflows/test-build-deploy.yml`.

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

## Dependency graph

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
