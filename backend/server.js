require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { readdirSync } = require('fs')



const app = express();

app.use(express.json());

app.use(cors())


connectDB();

readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)))




const PORT = process.env.PORT || 8080;
app.listen( PORT, () => { 
    console.log(`Server is running on PORT ${PORT}.`);
})