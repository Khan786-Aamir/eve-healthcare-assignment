import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/logger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRoutes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(compression());
app.use(requestLogger);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: "Server Running" });
});

app.use('/api/v1', apiRoutes);

app.use(errorHandler);

export default app;