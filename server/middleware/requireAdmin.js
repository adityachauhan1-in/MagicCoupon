import User from '../models/userModels.js';

export const requireAdmin = (req, res, next) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Admin check failed' });
  }
};

export default requireAdmin;

