const { v4: uuidv4 } = require("uuid");

// In-memory session store for stateful authentication
const sessionStore = new Map();

function setUser(user) {
    const sessionId = uuidv4();

    sessionStore.set(sessionId, {
        _id: user._id,
        email: user.email,
        createdAt: Date.now(),
    });
    return sessionId;
}

function getUser(sessionId) {
    if (!sessionId) {
        return null;
    }
    return sessionStore.get(sessionId) || null;
}

function removeUser(sessionId) {
    if (sessionId) {
        sessionStore.delete(sessionId);
    }
}

module.exports = { setUser, getUser, removeUser };