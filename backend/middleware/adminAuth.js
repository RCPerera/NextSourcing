import jwt from "jsonwebtoken";

const isAdminEmail = (email) => {
    const adminEmailPattern = /^Admin\d{3}@next\.com$/;
    return adminEmailPattern.test(email);
};

export const isAdmin = async (req, res, next) => {
    try {
        // First check if the user object exists in the request
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. Please log in.'
            });
        }
        
        // Then check if user has admin role
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin access required'
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message
        });
    }
};

const adminAuth = async (req, res, next) => {
    const {token} = req.cookies;
    
    if(!token){
        return res.json({success: false, message: 'Not Authorized. Login Again'});
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id && tokenDecode.role === 'admin' && isAdminEmail(tokenDecode.email)){
            req.body.userId = tokenDecode.id;
            next();
        } else {
            return res.json({ success: false, message: 'Admin access required'});
        }
    } catch (error) {
        res.json({ success: false, message: error.message});
    }
};

// Export both middlewares
export default adminAuth;