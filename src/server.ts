import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for request processing
app.use(express.json()); // Body parsing
app.use(morgan('dev'));  // Logging

import path from 'path';

import cors from 'cors';

// Import workers to start them
import './jobs/workers';

// Import routes
import authRoutes from './routes/auth.routes';
import reservationRoutes from './routes/reservation.routes';
import slotRoutes from './routes/slot.routes';
import dashboardRoutes from './routes/dashboard.routes';

// Basic route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Smart Parking System API is running.' });
});

app.use(cors()); // Allow cross-origin requests from Vite frontend

// Serve frontend website (We will eventually move this to React, but keep it for now)
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/dashboard', dashboardRoutes);

import http from 'http';
import { initSocket } from './socket';

// Use error handler middleware
app.use(errorHandler);

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
