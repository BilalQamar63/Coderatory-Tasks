import express, { Application } from 'express';
import path from 'path';
import router from './APIs';
import errorHandler from './middlewares/errorHandler';
import notFound from './handlers/notFound';
import helmet from 'helmet';
import cors from 'cors';  // Commented out if not using
import cookieParser from 'cookie-parser';

const fileUpload = require('express-fileupload');

const app: Application = express();

app.use(
    fileUpload({
        useTempFiles: true
    })
);

// Middlewares
app.use(helmet());
app.use(cookieParser());

// If you want to use CORS, uncomment the following:
app.use(
    cors({
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        origin: ['http://localhost:3001'], // Your frontend origin
        credentials: true
    })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));

// Router
router(app);

// Static directory for file uploads
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
