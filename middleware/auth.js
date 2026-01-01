// Check for Authentication
function isAuthenticated(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    req.user = req.session.user;
    next();
}

function isGuest(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    next();
}

module.exports = { isAuthenticated, isGuest };