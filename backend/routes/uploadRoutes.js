const express = require('express');
const router = express.Router();
const upload = require('../config/s3'); // Import our new AWS configuration
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/upload
// @desc    Upload an image to AWS S3
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  
  // AWS S3 puts the final URL inside req.file.location
  res.status(200).json({ imageUrl: req.file.location });
});

module.exports = router;