const jwt = require('jsonwebtoken');

function setUser(user) {
    return jwt.sign(user, process.env.JSON_SECRET || 'local-key')
}

function getUser(token) {
    if (!token) {
        return null;
    }
    return jwt.verify(token, process.env.JSON_SECRET || 'local_key');
}

function removeUser(sessionId) {
    if (sessionId) {
        sessionStore.delete(sessionId);
    }
}

module.exports = { setUser, getUser, removeUser };