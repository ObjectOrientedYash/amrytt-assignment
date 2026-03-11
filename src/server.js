import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import {createServer} from 'http';
import cors from 'cors';

import {connectDB} from './helpers/db.js';
import {connectSocket} from './helpers/socket.js';
import {swaggerUi, specs} from './helpers/swagger.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
connectSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);

/**
 * Health Check Route
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
