const Space = require('../models/Space');

// @desc    Create a new warehouse listing
// @route   POST /api/spaces
// @access  Public (for testing today, we lock this down later)
const createSpace = async (req, res) => {
  try {
    // 1. We no longer extract 'owner' from req.body. We only take the warehouse details.
    const { title, location, squareFootage, basePricePerDay } = req.body;

    if (!title || !location || !squareFootage || !basePricePerDay) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 2. Create the new warehouse. 
    // For the owner field, we use req.user.id (which our bouncer attached to the request!)
    const newSpace = await Space.create({
      owner: req.user.id,
      title,
      location,
      squareFootage,
      basePricePerDay
    });

    res.status(201).json(newSpace);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all active warehouse listings
// @route   GET /api/spaces
// @access  Public
const getSpaces = async (req, res) => {
  try {
    // Fetch all spaces where isActive is true
    const spaces = await Space.find({ isActive: true });
    
    // Send the array of spaces back to the frontend
    res.status(200).json(spaces);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Export the functions so our routes can use them
module.exports = {
  createSpace,
  getSpaces
};