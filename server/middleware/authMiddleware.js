import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

export const authMiddleware = async (req, res, next) => {
  console.log("🔥 authMiddleware triggered for:", req.method, req.originalUrl);
  console.log("JWT_SECRET is", process.env.JWT_SECRET);

  try {
    console.log("we are at authMiddleware");
    const authHeader = req.header('Authorization');
    console.log("authHeader is " + authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token missing' });
    }

    const token = authHeader.replace('Bearer ', '');

            //verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
              algorithms: ['HS256'],
              clockTolerance: 30
    });
console.log('decoded is ' + decoded)
    if (!decoded?.userId) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }
     
         // Find user (include role)
    const user = await User.findById(decoded.userId).select('_id role');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

         req.userId = user._id;
    req.userRole = user.role;
        next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};
