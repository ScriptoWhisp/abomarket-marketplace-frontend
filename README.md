# iti0302-2024-frontend

This is the frontend part of the project. To start the whole application
first read instructions, setup and start the backend part https://gitlab.cs.ttu.ee/datjul/iti0302-2024-backend


## Technologies Used

- **Node.js**
- **Vue.js**
- **Tailwind CSS**

## Requirements

- Node.js
- npm (comes with Node.js)
- IntelliJ IDEA (optional IDE with Vue.js plugin)


## Setup Instructions
### Install Dependencies

Navigate to the project directory and install the necessary packages:
    
```
npm install
```

### How to Build the Project
Compile and Minify for Production

To build the project for production, run:
```
npm run build
```

This will compile the Vue.js application and output the minified files to the dist directory.
How to Run the Application


### Compile and Hot-Reload for Development

To run the application in development mode with hot-reloading, execute:

```
npm run dev
```

The application will be accessible at http://localhost:3000 (or another port if specified).


## How to Build and Run Docker Containers

### Stage 1: Build the application
You can containerize the frontend application using Docker.
Build Docker Image

In the project root directory, execute the following command to build the Docker image:

```
docker build -t iti0302-2024-frontend:latest .
```

### Stage 2: Serve the application

Run the container using the image you've just built:

```
docker run -d -p 3000:3000 iti0302-2024-frontend:latest
```

The application will be accessible at http://localhost/3000.

### Optional: Serve the application with Docker Compose

Alternatively, you can use Docker Compose to build and run the application:

> NOTE: It will pull the image from the Docker Hub repository.

1. Create a `docker-compose.yml` file in the project root directory:

```yaml
services:
  frontend:
    image: scriptowhisp/crossover3-frontend:latest
    container_name: crossover3-frontend
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=development
```

2. Run the following command to build the image and run the container:

```
docker-compose up -d
```

The application will be accessible at http://localhost:3000.
