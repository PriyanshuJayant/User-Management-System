const express = require('express');
const router = express.Router();
const { handleUser_Signup,
    handleUser_Login,
    handleUser_Logout,
    handleRender_Login,
    handleRender_Signup
} = require('../controller/static')

// Render Pages
router.get('/login', handleRender_Login); // Needs Already Logged In Check
router.get('/signup', handleRender_Signup); // Needs Already Logged In Check

// Handlers
router.post('/api/signup', handleUser_Signup);
router.post('/api/login', handleUser_Login);
router.get('/api/logout', handleUser_Logout);

module.exports = router;