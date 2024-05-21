const app = require('./app');
const connectDB = require('./config/db');


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`App is running on port : ${PORT}`);
});
