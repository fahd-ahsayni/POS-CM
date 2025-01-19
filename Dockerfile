# Step 1: Build the application
FROM node:20-alpine as build
WORKDIR /app

# Install build dependencies - fixing package names
RUN apk add --no-cache \
    autoconf \
    automake \
    libtool \
    nasm \
    make \
    g++ \
    python3 \
    pkgconfig \
    build-base \
    yasm \
    jpeg-dev \
    zlib-dev

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps to handle compatibility issues
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy the built app from the previous stage
COPY --from=build /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
