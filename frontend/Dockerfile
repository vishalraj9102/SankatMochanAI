# Use the latest stable Node.js image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files into the container
COPY . .

# Expose the port for the app (default React port)
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
