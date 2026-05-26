const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  // Changed "owner" to "user" so it perfectly matches your controller
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  title: { type: String, required: true },
  location: { type: String, required: true },
  squareFootage: { type: Number, required: true },
  basePricePerDay: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Space', spaceSchema);