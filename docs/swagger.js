const swaggerDocument = {
    openapi: "3.0.1",
    info: {
        title: "Book API",
        description: `
        This API allows users to manage a collection of books. Users can register, login, 
        and perform various operations on books including creating, reading, updating, 
        and deleting them. The API supports role-based access with different permissions 
        for readers, authors, and admins.`,
        version: "1.0.0",
        contact: {
            name: "API Support",
            email: "support@example.com"
        }
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local development server"
        }
    ],
    tags: [
        {
            name: "Authentication",
            description: "Authentication-related operations"
        },
        {
            name: "Reader",
            description: "Operations available to readers"
        },
        {
            name: "Author",
            description: "Operations available to authors"
        },
        {
            name: "Admin",
            description: "Operations available to admins"
        }

    ],
    paths: {
        "/api/books": {
            get: {
                tags: ["Reader", "Author", "Admin"],
                summary: "Get a list of all books",
                description: "Retrieve a list of all books available in the collection.",
                responses: {
                    '200': {
                        description: "A JSON array of book objects",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Book"
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: "Internal server error"
                    }
                }
            },
            post: {
                tags: ["Author", "Admin"],
                summary: "Create a new book",
                description: "Add a new book to the collection. Only authors and admins can perform this operation.",
                requestBody: {
                    required: true,
                    content: {
                        "multipart/form-data": {
                            schema: {
                                type: "object",
                                properties: {
                                    coverPage: {
                                        type: "string",
                                        format: "binary"
                                    },
                                    title: {
                                        type: "string",
                                        example: "Fahrenheit 451"
                                    },
                                    author: {
                                        type: "string",
                                        example: "Ray Bradbury"
                                    },
                                    year: {
                                        type: "integer",
                                        example: 1953
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: "The created book object",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Book"
                                }
                            }
                        }
                    },
                    '400': {
                        description: "Invalid input"
                    },
                    '500': {
                        description: "Internal server error"
                    }
                }
            }
        },
        "/api/books/{id}": {
            get: {
                tags: ["Reader", "Author", "Admin"],
                summary: "Get a single book by ID",
                description: "Retrieve detailed information about a specific book using its ID.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "The ID of the book to retrieve",
                        schema: {
                            type: "string"
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: "A book object",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Book"
                                }
                            }
                        }
                    },
                    '404': {
                        description: "Book not found"
                    },
                    '500': {
                        description: "Internal server error"
                    }
                }
            },
            put: {
                tags: ["Author", "Admin"],
                summary: "Update a book by ID",
                description: "Update information for an existing book by its ID. Only authors and admins can perform this operation.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "The ID of the book to update",
                        schema: {
                            type: "string"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Book"
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: "The updated book object",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Book"
                                }
                            }
                        }
                    },
                    '400': {
                        description: "Invalid input"
                    },
                    '404': {
                        description: "Book not found"
                    },
                    '500': {
                        description: "Internal server error"
                    }
                }
            },
            delete: {
                tags: ["Admin"],
                summary: "Delete a book by ID",
                description: "Delete a book from the collection by its ID. Only admins can perform this operation.",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "The ID of the book to delete",
                        schema: {
                            type: "string"
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: "Successful deletion"
                    },
                    '404': {
                        description: "Book not found"
                    },
                    '500': {
                        description: "Internal server error"
                    }
                }
            }
        },
        "/api/auth/login": {
            post: {
                tags: ["Authentication"],
                summary: "User login",
                description: "Authenticate a user and obtain a JWT token.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    username: {
                                        type: "string",
                                        example: "admin"
                                    },
                                    password: {
                                        type: "string",
                                        example: "password"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: "Successful login",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        token: {
                                            type: "string",
                                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: "Unauthorized"
                    },
                    '500': {
                        description: "Internal server error"
                    }
                }
            }
        },
        "/api/auth/register": {
            post: {
                tags: ["Authentication"],
                summary: "User registration",
                description: "Register a new user with a role.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    username: {
                                        type: "string",
                                        example: "reader"
                                    },
                                    password: {
                                        type: "string",
                                        example: "password"
                                    },
                                    role: {
                                        type: "string",
                                        example: "Reader"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: "User successfully registered"
                    },
                    '400': {
                        description: "Invalid input"
                    },
                    '500': {
                        description: "Internal server error"
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            Book: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        example: "Moby-Dick"
                    },
                    author: {
                        type: "string",
                        example: "Herman Melville"
                    },
                    year: {
                        type: "integer",
                        example: 1851
                    }
                }
            },
            User: {
                type: "object",
                properties: {
                    username: {
                        type: "string",
                        example: "reader"
                    },
                    password: {
                        type: "string",
                        example: "password"
                    },
                    role: {
                        type: "string",
                        example: "Reader"
                    }
                }
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ]
};

module.exports = swaggerDocument;
