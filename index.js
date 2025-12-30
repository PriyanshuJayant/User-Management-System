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

const used = process.memoryUsage();
const memoryUsage = {
    rss: used.rss / 1024 / 1024,
    heapTotal: used.heapTotal / 1024 / 1024,
    heapUsed: used.heapUsed / 1024 / 1024,
    external: used.external / 1024 / 1024
};
const totalMB = Object.values(memoryUsage).reduce((acc, val) => acc + val, 0);
console.log('  rss:', memoryUsage.rss.toFixed(2), 'MB');
console.log('  heapTotal:', memoryUsage.heapTotal.toFixed(2), 'MB');
console.log('  heapUsed:', memoryUsage.heapUsed.toFixed(2), 'MB');
console.log('  external:', memoryUsage.external.toFixed(2), 'MB');
console.log('  Total:', totalMB.toFixed(2), 'MB');


// Server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})
