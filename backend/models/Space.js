const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This links the warehouse directly to the User who owns it
    required: true
  },
  title: { type: String, required: true },
  location: { type: String, required: true },
  squareFootage: { type: Number, required: true },
  basePricePerDay: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Space', spaceSchema);