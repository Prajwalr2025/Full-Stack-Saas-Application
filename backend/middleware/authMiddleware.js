const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the request has an authorization header that starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token (It looks like: "Bearer eyJhbG...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database using the ID hidden inside the token.
      // The .select('-password') part ensures we don't accidentally attach the password hash to the request.
      req.user = await User.findById(decoded.id).select('-password');

      // 5. The token is valid and the user is found. Let them through!
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If there was no token attached at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };