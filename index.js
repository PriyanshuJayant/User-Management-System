// Imports 
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/router.js');
const userData = require('./routes/static.js')
const { connectMongoDB } = require('./connections/mongoDB');
const path = require('path');
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const monitor = require('./functions/monitor.js')

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Connection
connectMongoDB(process.env.MONGODB_URL);

// Routes
app.use('/', userData);
app.use('/', userRouter);



// Monitor
monitor();

// Server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})
