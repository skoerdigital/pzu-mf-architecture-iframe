# Stage 1: Build the application
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the build output to the Nginx html directory
COPY --from=build /app/dist/apps/iframe-integrator /usr/share/nginx/html

# Copy custom Nginx configuration file if you have one
COPY ./apps/iframe-integrator/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script
COPY ./apps/iframe-integrator/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose the port Nginx will serve on
EXPOSE 80

# Command to run Nginx
CMD ["/docker-entrypoint.sh"]