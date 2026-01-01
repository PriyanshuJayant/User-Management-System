const session = require('express-session');

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'local-development-secret-keynrd',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true only in production
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict'
    }
}

module.exports = { sessionConfig };