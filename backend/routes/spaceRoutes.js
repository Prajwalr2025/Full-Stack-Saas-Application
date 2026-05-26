const express = require('express');
const router = express.Router();
const { createSpace, getSpaces, getOwnerSpaces } = require('../controllers/spaceController');

const { protect } = require('../middleware/authMiddleware');

// When a POST request hits this file's base URL, run the createSpace function
router.post('/', protect , createSpace);

// When a GET request hits this file's base URL, run the getSpaces function
router.get('/', getSpaces);

// When a GET request hits /api/spaces/me, run the getOwnerSpaces function
router.get('/me', protect, getOwnerSpaces);

module.exports = router;