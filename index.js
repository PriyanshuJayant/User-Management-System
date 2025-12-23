// Imports 
const express = require('express');
const app = express();
const userRouter = require('./routes/router.js');
const { connectMongoDB } = require('./connections/mongoDB');
const path = require('path');
require('dotenv').config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Connection
connectMongoDB(process.env.MONGODB_URL);


// Routes
app.use('/', userRouter)



app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`);
})

