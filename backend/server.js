import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/user/authRoutes.js";
import userRouter from "./routes/user/userRoutes.js";
import employeeRoutes from './routes/user/employeeRoutes.js';
import productRoutes from './routes/inventory/product.route.js';
import orderRoutes from './routes/order/order.routes.js';
import financeRoutes from './routes/finance/financeRoutes.js';

const app = express();
const port = process.env.PORT || 5000;
connectDB();

// Define allowed origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked for origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// API Endpoints
app.get('/', (req, res) => res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/employees', employeeRoutes);
app.use('/api/finance', financeRoutes);

// Inventory routes
app.use("/api/products", productRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try the following:`);
        console.error('1. Close any other instances of the server');
        console.error('2. Use a different port by setting the PORT environment variable');
        console.error('3. Wait a few minutes and try again');
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});