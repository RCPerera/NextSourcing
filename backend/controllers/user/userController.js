import userModel from "../../models/user/userModel.js";
import bcrypt from "bcrypt";

export const getUserDetails = async(req, res) => {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({ success: false, message: 'User not found'});
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find user and exclude password field
        const user = await userModel.findById(userId).select('-password -resetOtp -resetOtpExpireAt -verifyOtp -verifyOtpExpireAt');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        return res.json({
            success: true,
            user
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, address } = req.body;
        
        // If email is being updated, check if it's already taken by another user
        if (email) {
            const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.json({ success: false, message: "Email is already in use" });
            }
        }
        
        // Find and update user
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name: name || undefined,
                    email: email || undefined,
                    phone: phone || undefined,
                    address: address || undefined
                }
            },
            { new: true, runValidators: true }
        ).select('-password -resetOtp -resetOtpExpireAt -verifyOtp -verifyOtpExpireAt');
        
        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }
        
        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Update password
export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        // Validate input
        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: "Please provide both current and new passwords" });
        }
        
        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // Verify current password
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Current password is incorrect" });
        }
        
        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        
        return res.json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Delete user account
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Delete the user
        const deletedUser = await userModel.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // Clear the auth cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        
        return res.json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};