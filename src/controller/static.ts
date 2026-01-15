import { Request, Response } from 'express';
import User from '../models/Users';

export async function handleRender_Login(_req: Request, res: Response): Promise<void> {
    res.render('login.ejs');
}

export async function handleRender_Signup(_req: Request, res: Response): Promise<void> {
    res.render('signup.ejs');
}

export async function handleUser_Signup(req: Request, res: Response): Promise<void> {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            res.render('signup', { error: 'All fields are required' });
            return;
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.render('signup', { error: 'Email already registered. Please use a different email or login.' });
            return;
        }

        await User.create({ name, email, password });
        res.redirect('/login');
    } catch (error: any) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            res.render('signup', { error: 'Email already registered. Please use a different email.' });
            return;
        }
        res.render('signup', { error: 'Something went wrong. Please try again.' });
    }
}

export async function handleUser_Login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.render("login", { error: "Email and password are required" });
            return;
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            res.render("login", { error: "Email not registered" });
            return;
        }
        
        if (user.password !== password) {
            res.render("login", { error: "Incorrect password" });
            return;
        }

        // Store user info in session
        req.session.userId = user._id.toString();
        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        res.redirect("/dashboard");
    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

export async function handleUser_Logout(req: Request, res: Response): Promise<void> {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).json({ message: 'Logout Failed' });
            return;
        }
        res.redirect('/login');
    });
}
