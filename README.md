# Task Manager API

A RESTful API for managing tasks with user authentication, built with Node.js, Express, and MongoDB.

## Overview

Task Manager API is a backend service that allows users to create accounts, manage their personal tasks, and upload profile avatars. The application implements a complete authentication system using JSON Web Tokens (JWT) and provides endpoints for task and user management.

## Features

- **User Management**
  - User registration and authentication
  - Profile management
  - Avatar upload and retrieval
  - Secure password handling

- **Task Management**
  - Create, read, update, and delete tasks
  - Mark tasks as completed
  - Associate tasks with specific users

- **Authentication**
  - JWT-based authentication
  - Multiple session support
  - Secure logout from single or all sessions

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt.js** - Password hashing
- **validator.js** - Input validation
- **multer** - File uploads
- **sharp** - Image processing

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/mahin-hossen/task-manager-api.git
   cd task-manager-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### User Endpoints

- **POST /users** - Register a new user [source](https://github.com/mahin-hossen/task-manager-api/blob/main/src/routers/user.js#L9-L20) 

- **POST /users/login** - Login with credentials [source](https://github.com/mahin-hossen/task-manager-api/blob/main/src/routers/user.js#L22-L31) 

- **POST /users/logout** - Logout current session (requires authentication)

- **POST /users/logoutAll** - Logout from all sessions (requires authentication)

- **GET /users/me** - Get authenticated user profile (requires authentication)

- **PATCH /users/me** - Update user profile (requires authentication)

- **DELETE /users/me** - Delete user account (requires authentication)

### Avatar Endpoints

- **POST /users/me/avatar** - Upload profile picture (requires authentication) [source](https://github.com/mahin-hossen/task-manager-api/blob/main/src/routers/user.js#L118-L129) 

- **DELETE /users/me/avatar** - Delete profile picture (requires authentication) [source](https://github.com/mahin-hossen/task-manager-api/blob/main/src/routers/user.js#L131-L135) 

- **GET /users/:id/avatar** - Get user's profile picture [source](https://github.com/mahin-hossen/task-manager-api/blob/main/src/routers/user.js#L137-L150) 

### Task Endpoints

- **POST /tasks** - Create a new task (requires authentication)
- **GET /tasks** - Get all tasks for authenticated user (requires authentication)
- **GET /tasks/:id** - Get a specific task by ID (requires authentication)
- **PATCH /tasks/:id** - Update a task (requires authentication)
- **DELETE /tasks/:id** - Delete a task (requires authentication)

## Data Models

### User Model

The application uses a User model with the following schema: [source](https://github.com/mahin-hossen/task-manager-api/blob/main/src/model/userModel.js#L7-L53) 

### Task Model

Tasks are stored using the following schema: [source](https://github.com/mahin-hossen/task-manager-api/blob/main/src/model/taskModel.js#L2-L19) 

## Authentication

The API uses JWT-based authentication. Protected routes require an Authorization header with a valid token: [source](https://github.com/mahin-hossen/task-manager-api/blob/main/src/middleware/auth.js#L4-L17) 

## Server Setup

The application is configured in the main index.js file: [source](https://github.com/mahin-hossen/task-manager-api/blob/main/src/index.js#L1-L18) 

## License

[MIT](LICENSE)

## Author

[Mahin Hossen](https://github.com/mahin-hossen)
