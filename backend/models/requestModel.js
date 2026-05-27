const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    space: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Space', // Links to the specific warehouse
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links to the person requesting it
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links to the person who owns it
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    negotiatedPrice: {
      type: Number,
      required: true,
    },
    actionRequiredBy: {
      type: String,
      enum: ['owner', 'renter'],
      default: 'owner', // When a renter applies, the owner always goes first
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Negotiating'],
      default: 'Pending', // This is our State Machine!
    },
    renterNotes: {
      type: String, // E.g., "I need this for storing electronics"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Request', requestSchema);