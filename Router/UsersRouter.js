const express = require('express');
const router = express.Router();

const UserController = require('../Controller/UserController');

router.post('/Login', UserController.Login);

module.exports = router;