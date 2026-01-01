// Imports 
const express = require('express');
const app = express();
const userRouter = require('./routes/router.js');
const userData = require('./routes/static.js')
const { connectMongoDB } = require('./connections/mongoDB');
const { sessionConfig } = require('./middleware/express-session.js')
const path = require('path');
const PORT = process.env.PORT || 3000;
const session = require('express-session')
const memoryUsage = require('./service/memory.js')
require('dotenv').config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(session(sessionConfig));

// Connection
connectMongoDB(process.env.MONGODB_URL);

// Memory Usage
// memoryUsage();

// Routes
app.use('/', userData);
app.use('/', userRouter);







// Server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})
