const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig.js');
const swaggerDocument = require('./docs/swagger.js');
const connectDB = require('./config/db.js');

require('dotenv').config();

const app = express();


app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes.js');
const bookRoutes = require('./routes/bookRoutes.js');
const { morganMiddleware } = require('./middlewares/loggingMiddleware.js');

app.use(morganMiddleware);

// app.use("/", (req, res) => {
//     res.json({ message: "success", data: "Hello KRISENT" })
// })

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCssUrl: CSS_URL }));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Error Handling Middleware
const { errorHandler } = require('./middlewares/errorMiddleware.js');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`App is running on port : ${PORT}`);
});
