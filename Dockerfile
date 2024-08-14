# Use the official Node.js image as the base image for building
FROM node:20 AS build
 
# Set the working directory in the container
WORKDIR /app
 
# Copy the package.json and package-lock.json files
COPY package*.json ./
 
# Install the dependencies
RUN npm install
 
# Copy the rest of the application files
COPY . .
 
# Build the React application for production
RUN npm run build
 
# Use Nginx to serve the application
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html
 
# Expose port 80 to the host
EXPOSE 80
 
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
