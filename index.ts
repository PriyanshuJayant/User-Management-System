// Imports 
import express, { Application } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import userRouter from './src/routes/router';
import userData from './src/routes/static';
import { connectMongoDB } from './src/connections/mongoDB';
import { sessionMiddleware } from './src/middleware/express-session';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware); // Express session instead of cookie-parser
app.use(express.static(path.resolve('./src/public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./src/views'));

// Connection
const mongoURL = process.env._MONGODB_URL;
if (!mongoURL) {
    console.error('MongoDB URL is not defined in environment variables');
    process.exit(1);
}
connectMongoDB(mongoURL);

// Routes
app.use('/', userData);
app.use('/', userRouter);

// Server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    const used = process.memoryUsage();
    const memoryUsage = {
        rss: used.rss / 1024 / 1024,
        heapTotal: used.heapTotal / 1024 / 1024,
        heapUsed: used.heapUsed / 1024 / 1024,
        external: used.external / 1024 / 1024
    };
    const totalMB = Object.values(memoryUsage).reduce((acc, val) => acc + val, 0);
    console.log('Memory Usage:');
    console.log('  rss:', memoryUsage.rss.toFixed(2), 'MB');
    console.log('  heapTotal:', memoryUsage.heapTotal.toFixed(2), 'MB');
    console.log('  heapUsed:', memoryUsage.heapUsed.toFixed(2), 'MB');
    console.log('  external:', memoryUsage.external.toFixed(2), 'MB');
    console.log('  Total:', totalMB.toFixed(2), 'MB');
});

