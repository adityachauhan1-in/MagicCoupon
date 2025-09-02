import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token missing' });
    }

    const token = authHeader.replace('Bearer ', '');

//verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      clockTolerance: 30
    });

    if (!decoded?.userId) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    // Find user
    const user = await User.findById(decoded.userId).select('_id');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};
