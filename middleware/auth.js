
// Check for Authentication
function isAuthenticated(req, res, next) {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.redirect('/login');
    }

    const user = getUser(sessionId);

    if (!user) {
        res.clearCookie('sessionId');
        return res.redirect('/login');
    }
    
    req.user = user;
    next();
}

// Check for Alreadt Loged in
function isGuest(req, res, next) {
    const sessionId = req.cookies.sessionId;

    const user = getUser(sessionId);

    if (sessionId && user) {
        return res.redirect('/dashboard');
    }
    next();
}

module.exports = { isAuthenticated, isGuest };