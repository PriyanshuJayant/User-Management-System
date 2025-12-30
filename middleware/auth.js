const { getUser } = require('../service/auth_Service.js');

// Middleware: Check if user is logged in
function isAuthenticated(req, res, next) {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.redirect('/login');
    }

    const user = getUser(sessionId);

    if (!user) {
        // Invalid or expired session
        res.clearCookie('sessionId');
        return res.redirect('/login');
    }

    // Attach user data to request for use in routes
    req.user = user;

    next();
}

// Middleware: Redirect if already logged in (for login/signup pages)
function isGuest(req, res, next) {
    const sessionId = req.cookies.sessionId;

    if (sessionId && getUser(sessionId)) {
        return res.redirect('/dashboard');
    }

    next();
}

module.exports = { isAuthenticated, isGuest };
