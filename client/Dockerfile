# Stage 1 - Build
FROM node:18-alpine as build

WORKDIR /app

# Copy only package files and install dependencies
COPY package*.json ./
RUN npm install

# Then copy everything else except node_modules (excluded via .dockerignore)
COPY . .

# Build the project
RUN npm run build

# Stage 2 - Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
