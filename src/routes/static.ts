import express, { Router } from 'express';
import {
    handleUser_Signup,
    handleUser_Login,
    handleUser_Logout,
    handleRender_Login,
    handleRender_Signup
} from '../controller/static';
import { isGuest } from '../middleware/auth';

const router: Router = express.Router();

// Render Pages - Check if user is already logged in
router.get('/login', isGuest, handleRender_Login);
router.get('/signup', isGuest, handleRender_Signup);

// Handlers
router.post('/api/signup', handleUser_Signup);
router.post('/api/login', handleUser_Login);
router.get('/api/logout', handleUser_Logout);

export default router;
