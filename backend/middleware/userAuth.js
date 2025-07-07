import jwt from "jsonwebtoken";
import userModel from "../models/user/userModel.js";

/**
 * Middleware for authenticating users based on JWT token in cookies or Authorization header
 * Adds user data to req.user object for use in protected routes
 */
const userAuth = async (req, res, next) => {
  let token;
  
  // Check for token in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("Auth check - Found token in cookies");
  } 
  // Check for token in Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log("Auth check - Found token in Authorization header");
  }
  
  if(!token) {
    console.log("No auth token found in cookies or Authorization header");
    return res.status(401).json({
      success: false, 
      message: 'Not authorized. Please login to continue.'
    });
  }
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully for user ID:", decoded.id);
    
    if(!decoded || !decoded.id) {
      console.log("Invalid decoded token:", decoded);
      return res.status(401).json({ 
          success: false, 
          message: 'Invalid authentication token. Please login again.'
      });
    }
    
    // Find user by id and exclude password field
    const user = await userModel.findById(decoded.id).select('-password');
    
    if(!user) {
      console.log("User not found for ID:", decoded.id);
      return res.status(401).json({ 
          success: false, 
          message: 'User associated with this token no longer exists.'
      });
    }
    
    console.log("User authenticated successfully:", user.name);
    
    // Add user data to request object for use in route handlers
    req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAccountVerified: user.isAccountVerified,
        // Include other fields as needed, but exclude sensitive information
    };
    
    next();
    
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ 
        success: false, 
        message: 'Authentication error: ' + error.message
    });
  }
};

export default userAuth;