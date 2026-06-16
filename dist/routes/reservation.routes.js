"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservation_controller_1 = require("../controllers/reservation.controller");
const router = (0, express_1.Router)();
// GET /api/reservations/availability/:spotId
router.get('/availability/:spotId', reservation_controller_1.checkAvailability);
// POST /api/reservations
router.post('/', reservation_controller_1.createReservation);
exports.default = router;
