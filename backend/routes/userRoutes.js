const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// When a POST request hits /api/users, run the register function
router.post('/', registerUser);

// When a POST request hits /api/users/login, run the login function
router.post('/login', loginUser);

module.exports = router;