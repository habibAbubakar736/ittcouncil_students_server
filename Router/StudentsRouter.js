const express = require('express');
const router = express.Router();

const StudentsProfile = require('../Controller/StudentsProfile');
const AuthMiddleware = require("../Middleware/AuthMiddleware")

router.get('/GetStudentsProfile', AuthMiddleware.AuthMiddleware, StudentsProfile.GetStudentsProfile);


// ------------------------- exam route ------------------------- // 
router.get('/GetUpcomingExam', AuthMiddleware.AuthMiddleware, StudentsProfile.GetUpcomingExam);
router.get('/ExamQuestion', AuthMiddleware.AuthMiddleware, StudentsProfile.ExamQuestion);


module.exports = router;