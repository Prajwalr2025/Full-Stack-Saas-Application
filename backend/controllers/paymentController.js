const Razorpay = require('razorpay');
const Request = require('../models/requestModel');

// Initialize Razorpay with dummy/test keys
// (In a real app, these go in your .env file!)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Suk2hWYVnbXvAQ', 
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'ei2V9cDDHEYjem8T5tcl8B6F'
});

// @desc    Create a Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private (Renter only)
const createOrder = async (req, res) => {
  try {
    const { requestId } = req.body;
    
    // 1. Find the approved lease request
    const leaseRequest = await Request.findById(requestId);
    if (!leaseRequest) {
      return res.status(404).json({ message: 'Lease request not found' });
    }

    // 2. Setup the Razorpay order options
    const options = {
      amount: leaseRequest.negotiatedPrice * 100, // Razorpay expects amount in PAISE (multiply by 100)
      currency: 'INR',
      receipt: `receipt_${requestId.toString().slice(-6)}`, // A short, unique receipt ID
    };

    // 3. Ask Razorpay to create the order
    const order = await razorpay.orders.create(options);
    
    // 4. Send the official Order ID back to React
    res.status(200).json(order);
  } catch (error) {
    console.error("DEBUG - Razorpay Error:", error);
    res.status(500).json({ message: 'Failed to initiate payment' });
  }
};

// @desc    Verify Payment (Webhook/Callback)
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  // For this MVP, we will just simulate a successful verification 
  // and update the lease status to 'Paid'!
  try {
    const { requestId } = req.body;
    
    const leaseRequest = await Request.findByIdAndUpdate(
      requestId, 
      { status: 'Paid' }, // We transition from 'Approved' to 'Paid'!
      { new: true }
    );

    res.status(200).json({ message: 'Payment verified successfully', leaseRequest });
  } catch (error) {
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

module.exports = { createOrder, verifyPayment };