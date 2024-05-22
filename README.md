# Book API

## Overview

This API allows users to manage a collection of books. Users can register, login, and perform various operations on books including creating, reading, updating, and deleting them. The API supports role-based access with different permissions for readers, authors, and admins.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/hariomfw21/kriscent_Book-management
    cd book-api
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/bookapi
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```bash
    npm start
    # or
    yarn start
    ```

## API Documentation

The API is documented using Swagger. After starting the server, you can access the API documentation at `https://kriscent-book-management-1.onrender.com/api/docs` or `http://localhost:3000/api/docs`.

### Authentication

#### Register

- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user with a role.
- **Request Body**:
    ```json
    {
        "username": "reader",
        "password": "password",
        "role": "Reader"
    }
    ```
- **Responses**:
    - `201`: User successfully registered
    - `400`: Invalid input
    - `500`: Internal server error

#### Login

- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate a user and obtain a JWT token.
- **Request Body**:
    ```json
    {
        "username": "admin",
        "password": "password"
    }
    ```
- **Responses**:
    - `200`: Successful login
    - `401`: Unauthorized
    - `500`: Internal server error

### Books

#### Get All Books

- **Endpoint**: `GET /api/books`
- **Description**: Retrieve a list of all books available in the collection.
- **Responses**:
    - `200`: A JSON array of book objects
    - `500`: Internal server error

#### Get Book by ID

- **Endpoint**: `GET /api/books/{id}`
- **Description**: Retrieve detailed information about a specific book using its ID.
- **Parameters**:
    - `id` (path): The ID of the book to retrieve
- **Responses**:
    - `200`: A book object
    - `404`: Book not found
    - `500`: Internal server error

#### Create a Book

- **Endpoint**: `POST /api/books`
- **Description**: Add a new book to the collection. Only authors and admins can perform this operation.
- **Request Body**:
    ```json
    {
        "coverPage": "<binary>",
        "title": "Fahrenheit 451",
        "author": "Ray Bradbury",
        "year": 1953
    }
    ```
- **Responses**:
    - `201`: The created book object
    - `400`: Invalid input
    - `500`: Internal server error

#### Update a Book by ID

- **Endpoint**: `PUT /api/books/{id}`
- **Description**: Update information for an existing book by its ID. Only authors and admins can perform this operation.
- **Parameters**:
    - `id` (path): The ID of the book to update
- **Request Body**:
    ```json
    {
        "title": "Moby-Dick",
        "author": "Herman Melville",
        "year": 1851
    }
    ```
- **Responses**:
    - `200`: The updated book object
    - `400`: Invalid input
    - `404`: Book not found
    - `500`: Internal server error

#### Delete a Book by ID

- **Endpoint**: `DELETE /api/books/{id}`
- **Description**: Delete a book from the collection by its ID. Only admins can perform this operation.
- **Parameters**:
    - `id` (path): The ID of the book to delete
- **Responses**:
    - `200`: Successful deletion
    - `404`: Book not found
    - `500`: Internal server error

## Security

The API uses JWT for authentication. To access protected routes, include the token in the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
