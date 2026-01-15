import { Request, Response, NextFunction } from 'express';

// Check for Authentication
export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (!req.session.userId) {
        res.redirect('/login');
        return;
    }
    
    req.user = req.session.user;
    next();
}

// Check if Already Logged In
export function isGuest(req: Request, res: Response, next: NextFunction): void {
    if (req.session.userId) {
        res.redirect('/dashboard');
        return;
    }
    next();
}
