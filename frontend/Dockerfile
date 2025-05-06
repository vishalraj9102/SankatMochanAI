# Use the latest stable Node.js image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the files into the container
COPY . .

# Expose port for the app (default React port)
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
