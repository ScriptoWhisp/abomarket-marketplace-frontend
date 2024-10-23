# Use a base node image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port that Vite will run on (default 5173)
EXPOSE 3000

# Command to start Vite
CMD ["npm", "run", "dev"]