# Base stage
FROM node:18-alpine as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Development stage
FROM base as development

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production build stage
FROM base as build

RUN npm run build

# Production stage with nginx
FROM nginx:stable-alpine as production

COPY --from=build /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
