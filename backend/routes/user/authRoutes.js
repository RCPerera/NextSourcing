import express from 'express'
import { 
  login, 
  logout, 
  register, 
  sendVerifyOtp, 
  verifyEmail, 
  sendResetOtp, 
  resetPassword,
} from '../../controllers/user/authController.js';
import userAuth from '../../middleware/userAuth.js';

const authRouter = express.Router();

// Authentication routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Email verification routes
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);

// Password recovery routes
authRouter.post('/send-resetOtp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

// Authentication verification
authRouter.get('/is-auth', userAuth, (req, res) => {
  // Return user info if authenticated
  res.json({
    success: true,
    user: req.user
  });
});

// Add to your authRoutes.js
authRouter.get('/ping', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication server is running',
    timestamp: new Date().toISOString()
  });
});

export default authRouter;