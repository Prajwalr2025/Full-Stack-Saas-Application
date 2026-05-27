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
  imageUrl: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop' // A nice default warehouse image just in case
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Space', spaceSchema);