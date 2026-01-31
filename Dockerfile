# Use the lightweight Alpine-based Node.js image
FROM node:23-alpine

# Set the working directory
WORKDIR /app

# Copy dependency definitions first to leverage Docker cache
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (Render.com defaults to 10000)
EXPOSE 10000

# Start the application using tsx as defined in package.json
CMD ["npm", "start"]