# Stage 1: Build the application
FROM node:alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./dist/apps .

RUN npm run build:all

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /app /usr/share/nginx/html

# Copy custom Nginx configuration file if you have one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will serve on
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]