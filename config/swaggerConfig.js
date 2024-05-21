const swaggerJSDoc = require('swagger-jsdoc');
require("dotenv").config()
const path=require('path');
const BACKEND_DEPLOYED_URL=process.env.BACKEND_DEPLOYED_URL||"http://localhost:3000/"
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Specify the OpenAPI version
        info: {
            title: 'Library Management System',
            version: '1.0.0',
            description: 'Documentation for library management',
        },
        servers: [
            {
                url:BACKEND_DEPLOYED_URL,
            }
        ]
    },
    // Provide the path to your API routes files
    apis: [path.join(__dirname, '..', 'docs', 'swagger.js')],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;