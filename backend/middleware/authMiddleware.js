import jwt from 'jsonwebtoken';
import User from '../models/user/userModel.js';

// Protect routes - verify user authentication
export const protect = async (req, res, next) => {
    try {
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
        
        if (!token) {
            console.log("No auth token found in cookies or Authorization header");
            return res.status(401).json({
                success: false,
                message: 'Access denied. Please log in.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user and attach to request
        // Exclude password from the returned user object
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token: ' + error.message
        });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        // Check if user exists and has admin role from the protect middleware
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Please log in.'
            });
        }

        // Check admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false, 
                message: 'Access denied. Admin privileges required.'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};