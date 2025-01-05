# Use the official Node.js image
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files
COPY . .

# Expose the development server port
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]
