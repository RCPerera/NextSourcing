import express from 'express';
import userAuth from '../../middleware/userAuth.js';
import { getUserDetails, getProfile, updatePassword, updateProfile, deleteAccount } from '../../controllers/user/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserDetails);
// User profile management routes
userRouter.get('/profile', userAuth, getProfile);
userRouter.put('/profile', userAuth, updateProfile);
userRouter.put('/update-password', userAuth, updatePassword);
userRouter.delete('/profile', userAuth, deleteAccount);

export default userRouter;