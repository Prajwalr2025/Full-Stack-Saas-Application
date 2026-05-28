const Request = require('../models/requestModel');
const Space = require('../models/Space');

// @desc    Renter applies for a space
// @route   POST /api/requests
// @access  Private (Renters only)
// @desc    Renter applies for a space
// @route   POST /api/requests
// @access  Private (Renters only)
const createRequest = async (req, res) => {
  const { spaceId, startDate, endDate, totalPrice, proposedPrice, renterNotes } = req.body;

  try {
    const space = await Space.findById(spaceId);
    
    if (!space) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    const request = await Request.create({
      space: spaceId,
      renter: req.user.id,
      owner: space.owner || space.user,
      startDate,
      endDate,
      totalPrice, 
      negotiatedPrice: proposedPrice || totalPrice, 
      actionRequiredBy: 'owner', 
      renterNotes
    });

    res.status(201).json(request);
  } catch (error) {
    // NEW: This will print the EXACT reason it crashed to your terminal!
    console.error("DEBUG - Create Request Error:", error); 
    res.status(500).json({ message: 'Failed to submit lease request' });
  }
};

// @desc    Get requests for the logged-in Renter
// @route   GET /api/requests/renter
// @access  Private
const getRenterRequests = async (req, res) => {
  try {
    // Find requests where this user is the renter, and pull in the Space details
    const requests = await Request.find({ renter: req.user.id }).populate('space', 'title location imageUrl');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your applications' });
  }
};

// @desc    Get requests for the logged-in Owner
// @route   GET /api/requests/owner
// @access  Private
const getOwnerRequests = async (req, res) => {
  try {
    // Find requests where this user is the owner, and pull in Renter and Space details
    const requests = await Request.find({ owner: req.user.id })
      .populate('space', 'title')
      .populate('renter', 'name email'); // Let the owner see who is requesting it!
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch incoming requests' });
  }
};

// @desc    Update request status (Approve/Reject/Negotiate)
// @route   PUT /api/requests/:id/status
// @access  Private (Owner or Renter)
const updateRequestStatus = async (req, res) => {
  const { status, newPrice } = req.body;

  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // 1. Identify who is making the request (Are they the Renter or the Owner?)
    const isOwner = request.owner.toString() === req.user.id;
    const isRenter = request.renter.toString() === req.user.id;

    if (!isOwner && !isRenter) {
      return res.status(401).json({ message: 'Not authorized to view this request' });
    }

    const userRoleInRequest = isOwner ? 'owner' : 'renter';

    // 2. Ensure it is actually their turn!
    if (request.actionRequiredBy !== userRoleInRequest) {
      return res.status(400).json({ message: 'Please wait for the other party to respond.' });
    }

    // 3. Handle the 'Negotiating' Ping-Pong
    if (status === 'Negotiating') {
      if (!newPrice) {
        return res.status(400).json({ message: 'A new price must be provided to negotiate' });
      }
      request.negotiatedPrice = newPrice;
      request.status = 'Negotiating';
      // Flip the turn to the OTHER person
      request.actionRequiredBy = isOwner ? 'renter' : 'owner'; 
    } 
    // 4. Handle Final Decisions (Approve/Reject)
    else if (['Approved', 'Rejected'].includes(status)) {
      request.status = status;
      request.actionRequiredBy = null; 
      
      // NEW: If the lease is approved, take the warehouse off the market!
      if (status === 'Approved') {
        await Space.findByIdAndUpdate(request.space, { isActive: false });
      }
    } else {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedRequest = await request.save();
    res.status(200).json(updatedRequest);
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

module.exports = {
  createRequest,
  getRenterRequests,
  getOwnerRequests,
  updateRequestStatus
};