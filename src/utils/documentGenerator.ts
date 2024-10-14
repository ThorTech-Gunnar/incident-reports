# Build and Deployment Instructions

Follow these steps to build and deploy the Incident Management SaaS application:

## 1. Environment Setup

1. Create a `.env` file in the root directory of the project.
2. Copy the contents of `.env.example` to `.env`.
3. Set the appropriate API URL for your production environment:

```
VITE_API_URL=https://your-production-api-url.com/api
```

## 2. Install Dependencies

Ensure all necessary dependencies are installed:

```bash
npm install
```

## 3. Build the Application

Create a production-ready build:

```bash
npm run build
```

This command will generate optimized static files in the `dist` directory.

## 4. Test the Production Build

Before deploying, test the production build locally:

```bash
npm run preview
```

This will serve the production build locally. Verify that everything works as expected.

## 5. Deploy the Application

Deploy the contents of the `dist` directory to your hosting provider. Here are some common deployment options:

### Option A: Static Hosting (e.g., Netlify, Vercel)

1. Connect your repository to the hosting provider.
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set the environment variables in the hosting provider's dashboard.

### Option B: Traditional Web Server (e.g., Nginx, Apache)

1. Copy the contents of the `dist` directory to your web server's public directory.
2. Configure your web server to serve the `index.html` file for all routes.

### Option C: Docker Deployment

1. Create a Dockerfile in the project root:

```dockerfile
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Build and run the Docker image:

```bash
docker build -t incident-management-saas .
docker run -p 80:80 incident-management-saas
```

## 6. Post-Deployment Steps

1. Set up SSL/TLS certificates for secure HTTPS connections.
2. Configure proper caching headers for static assets.
3. Set up monitoring and logging tools.
4. Perform thorough testing on the live environment.

## 7. Continuous Integration/Continuous Deployment (CI/CD)

Consider setting up a CI/CD pipeline for automated testing and deployment:

1. Use tools like GitHub Actions, GitLab CI, or Jenkins.
2. Configure the pipeline to run tests, build the application, and deploy automatically on successful builds.

## 8. Maintenance

1. Regularly update dependencies to patch security vulnerabilities.
2. Monitor application performance and error logs.
3. Implement a backup strategy for critical data.

By following these steps, you'll have a production-ready build of the Incident Management SaaS application deployed and running securely.