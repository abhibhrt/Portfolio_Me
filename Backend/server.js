import 'dotenv/config';
import './db.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import progressRoute from './routes/progressRoute.js';
import contactRoute from './routes/contactRoute.js';
import projectRoute from './routes/projectRoute.js';
import adminRoute from './routes/adminRoute.js';

const app = express();

// Middleware

// security headers
app.use(helmet());

// enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
));

// rate limiter (100 requests per 15 min per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  message: { status: 'error', message: 'too many requests, try again later' }
});
// app.use(limiter);

// request logging
app.use(morgan('combined'));

// body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/', (req, res) => {
  res.send("api is running...");
})
app.use('/api/progress', progressRoute);
app.use('/api/contacts', contactRoute);
app.use('/api/projects', projectRoute);
app.use('/api/auth', adminRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'internal server error', error: err.message.toLowerCase() });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running at http://localhost:${PORT}`));