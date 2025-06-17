# Use official Node.js LTS image
FROM node:lts-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package and lock files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --production

# Copy app source code
COPY app.js ./
COPY public ./public

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
