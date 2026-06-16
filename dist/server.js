"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware for request processing
app.use(express_1.default.json()); // Body parsing
app.use((0, morgan_1.default)('dev')); // Logging
// Import workers to start them
require("./jobs/workers");
// Import routes
const reservation_routes_1 = __importDefault(require("./routes/reservation.routes"));
// Basic route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Smart Parking System API is running.' });
});
app.use('/api/reservations', reservation_routes_1.default);
// Use error handler middleware
app.use(error_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
