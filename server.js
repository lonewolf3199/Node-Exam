const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const db = require('./Models')
const userRoute = require('./Routes/userRoute')

dotenv.config({path: './config.env'});

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser())

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Database has been ReSync");
// })

app.use('/api/users', userRoute)

app.listen(PORT, () => console.log(`Server is Running on ${PORT}`));