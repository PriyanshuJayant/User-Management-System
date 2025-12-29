const express = require('express');
const router = express.Router();
const { handleUser_Signup,
    handleUser_Login,
    handleUser_Logout,
    handleRender_Login,
    handleRender_Signup
} = require('../controller/static')

// Render Pages
router.get('/login', handleRender_Login);
router.get('/signup', handleRender_Signup);

// Handlers
router.post('/api/login', handleUser_Login);
router.post('/api/signup', handleUser_Signup);
router.get('/api/logout', handleUser_Logout);

module.exports = router;