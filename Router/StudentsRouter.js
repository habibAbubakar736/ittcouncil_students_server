const express = require('express');
const router = express.Router();

const StudentsProfile = require('../Controller/StudentsProfile');
const AuthMiddleware = require("../Middleware/AuthMiddleware")

router.get('/GetStudentsProfile', AuthMiddleware.AuthMiddleware, StudentsProfile.GetStudentsProfile);


// ------------------------- exam route ------------------------- // 
router.get('/GetUpcomingExam', AuthMiddleware.AuthMiddleware, StudentsProfile.GetUpcomingExam);
router.get('/GetExamInfo', AuthMiddleware.AuthMiddleware, StudentsProfile.GetExamInfo);
router.get('/ExamQuestion', AuthMiddleware.AuthMiddleware, StudentsProfile.ExamQuestion);

router.get('/GetStudentsProgram', AuthMiddleware.AuthMiddleware, StudentsProfile.GetStudentsProgram);
router.get('/GetPassOutSubjects', AuthMiddleware.AuthMiddleware, StudentsProfile.GetPassOutSubjects);
router.get('/GetFailedOutSubjects', AuthMiddleware.AuthMiddleware, StudentsProfile.GetFailedOutSubjects);

module.exports = router;