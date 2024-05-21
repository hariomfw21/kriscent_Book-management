const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const swaggerDocument = require('./docs/swagger.js');
require('dotenv').config();

const app = express();


app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const { morganMiddleware } = require('./middlewares/loggingMiddleware');

app.use(morganMiddleware);

const CSS_URL ="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCssUrl: CSS_URL }));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Error Handling Middleware
const { errorHandler } = require('./middlewares/errorMiddleware');
app.use(errorHandler);

module.exports = app;
