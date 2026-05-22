const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'QUOTED', 'AWAITING_PAYMENT', 'ACTIVE_LEASE', 'REJECTED'],
    default: 'PENDING'
  },
  quotedPrice: { type: Number },
  renterNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Lease', leaseSchema);