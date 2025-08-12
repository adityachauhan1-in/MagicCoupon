import jwt from 'jsonwebtoken'
import User from '../models/userModels.js'
export const authMiddleware = async (req, res, next) => {
                                                   // authMiddleware.js
  try {
    // console.log('\n=== NEW REQUEST ===');
    // console.log('Request headers:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // console.log('Extracted token:', token);

    if (!token) {
      throw new Error('No token provided');
    }

    // Verify token with detailed error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'],
        clockTolerance: 30 // 30 seconds grace period for clock skew
      });
      // console.log('Successfully decoded token:', decoded);
    } catch (verifyError) {
      console.error('Token verification failed:', {
        name: verifyError.name,
        message: verifyError.message,
        expiredAt: verifyError.expiredAt,
        dateNow: new Date()
      });
      throw verifyError;
    }

    // Verify user exists
    const user = await User.findById(decoded.userId).select('_id');
    // console.log('Found user:', user?._id);
    
    if (!user) {
      throw new Error('User no longer exists');
    }

    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Final auth error:', {
      error: error.message,
      stack: error.stack
    });
    return res.status(401).json({
      success: false,
      message: 'Not authorized: ' + error.message
    });
  }
};