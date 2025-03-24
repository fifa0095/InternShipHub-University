require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');


const app = express();

app.use(express.json());

connectDB();

app.use('/api', require('./routes/blog'));




const PORT = process.env.PORT || 8080;
app.listen( PORT, () => { 
    console.log(`Server is running on PORT ${PORT}.`);
})