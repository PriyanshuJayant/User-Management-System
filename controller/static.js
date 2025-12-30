const User = require('../models/Users.js');
const { setUser, removeUser } = require('../service/auth_Service.js');

async function handleRender_Login(req, res) {
    return res.render('login.ejs');
}

async function handleRender_Signup(req, res) {
    return res.render('signup.ejs');
}

async function handleUser_Signup(req, res) {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.render('signup', { error: 'All fields are required' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { error: 'Email already registered. Please use a different email or login.' });
        }

        await User.create({ name, email, password });
        return res.redirect('/login');
    } catch (error) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return res.render('signup', { error: 'Email already registered. Please use a different email.' });
        }
        return res.render('signup', { error: 'Something went wrong. Please try again.' });
    }
}

async function handleUser_Login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("login", { error: "Email and password are required" });
        }

        // Step 1: Find user by EMAIL only
        const user = await User.findOne({ email });

        // Step 2: Check if user exists
        if (!user) {
            return res.render("login", { error: "Email not registered" });
        }

        // Step 3: Check if password matches
        if (user.password !== password) {
            return res.render("login", { error: "Incorrect password" });
        }

        // Create session and get sessionId
        const sessionId = setUser(user);
        // Set cookie in browser
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000  // 24 hours
        });

        return res.redirect("/dashboard");


    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

async function handleUser_Logout(req, res) {
    const sessionId = req.cookies.sessionId;
    removeUser(sessionId);
    res.clearCookie('sessionId');

    return res.redirect('/login');
}

module.exports = {
    handleUser_Login,
    handleUser_Signup,
    handleUser_Logout,
    handleRender_Login,
    handleRender_Signup
}