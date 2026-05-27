const express = require('express');
const router = express.Router();
// Import the new function
const { createRequest, getRenterRequests, getOwnerRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/renter', protect, getRenterRequests);
router.get('/owner', protect, getOwnerRequests);
// Add the new PUT route for updating status
router.put('/:id/status', protect, updateRequestStatus); 

module.exports = router;