// Imports 
const express = require('express');
const app = express();
const userRouter = require('./routes/router.js');
const userData = require('./routes/static.js')
const { connectMongoDB } = require('./connections/mongoDB');
const path = require('path');
const PORT = process.env.PORT || 3000;
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
app.use('/', userRouter);
app.use('/', userData);


// Server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})