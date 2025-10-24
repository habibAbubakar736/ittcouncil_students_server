const express = require('express');
const router = express.Router();

const DashboardController = require('../Controller/DashboardController');
const AuthMiddleware = require("../Middleware/AuthMiddleware")

router.get('/GetDashboardStates', AuthMiddleware.AuthMiddleware, DashboardController.GetDashboardStates);

module.exports = router;