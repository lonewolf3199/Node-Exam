const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const db = require('./Models')

dotenv.config({path: ' ./config.env'});

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())

app.listen(PORT, () => console.log(`Server is Running on ${PORT}`));