import session, { SessionOptions } from 'express-session';

export const sessionConfig: SessionOptions = {
    secret: process.env.SESSION_SECRET || 'local-development-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict'
    }
};

export const sessionMiddleware = session(sessionConfig);
