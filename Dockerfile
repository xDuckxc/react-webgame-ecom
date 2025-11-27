# === 1. Build Stage: Compiles React/Next.js assets ===
FROM node:20.18.0-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Install build dependencies (Necessary for native modules like node-gyp, which was in your original logs)
# You may not need all of these if your project has no native dependencies, but it's safe to keep based on your logs.
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential node-gyp openssl pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy package files (package.json and lockfile) first to leverage Docker caching.
# If these files don't change, the 'npm install' step won't rerun.
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Run the build command
# If your project is Next.js, 'npm run build' typically executes 'next build'.
# If you are using Create React App, this command should execute 'react-scripts build' 
# (which places assets in a folder named 'build').
RUN npm run build

# === 2. Release Stage: Serves the compiled static assets ===
# Use a very small, secure image to host the final production assets
FROM nginx:alpine AS final

# Copy the built assets from the 'build' stage to the Nginx public directory
# ASSUMPTION: The 'npm run build' command creates a production build in a folder named 'build' or 'dist'.
# For Create React App, it's typically 'build'. If using Next.js static export, it's 'out'.
# CHANGE THE SOURCE FOLDER BELOW IF YOUR BUILD OUTPUT IS DIFFERENT (e.g., '/app/out' for Next.js)
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default HTTP port for Fly.io
EXPOSE 8080

# Command to run Nginx, which serves the static files (default Nginx behaviour)
CMD ["nginx", "-g", "daemon off;"]