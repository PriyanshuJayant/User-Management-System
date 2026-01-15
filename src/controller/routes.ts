import { Request, Response } from 'express';
import Entries from '../models/Schema';
import { Types } from 'mongoose';

// GET all entries
export async function handleGetUserData(_req: Request, res: Response): Promise<void> {
    try {
        const allUsers = await Entries.find({});
        res.send(allUsers);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
}

// Get Entry by ID
export async function handleGetUserById(req: Request, res: Response): Promise<void> {
    try {
        const userID = req.params.id;
        if (!userID) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        const user = await Entries.findById(userID);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({
            message: "Error Finding User",
            error: error.message
        });
    }
}

// Delete Entry by ID
export async function handleDeleteUserById(req: Request, res: Response): Promise<void> {
    try {
        const userID = req.params.id;
        if (!userID) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        const user = await Entries.findByIdAndDelete(userID);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(202).json({
            message: 'User Deleted Successfully',
            id: userID
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error Finding User",
            error: error.message
        });
    }
}

// Update Entry by ID
export async function handleUpdateUserByID(req: Request, res: Response): Promise<void> {
    try {
        const userID = req.params.id;
        if (!userID) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        const update = req.body;
        if (!Object.keys(update).length) {
            res.status(400).json({ message: 'No update Data Provided' });
            return;
        }
        const updateUser = await Entries.findByIdAndUpdate(
            userID,
            update,
            { new: true, runValidators: true }
        );

        if (!updateUser) {
            res.status(404).json({ message: 'User not Found' });
            return;
        }
        res.json({
            message: 'User Updated',
            updateUser
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error Finding User",
            error: error.message
        });
    }
}

// Render Home Page
export async function handleRenderHomePage(_req: Request, res: Response): Promise<void> {
    try {
        const allUsers = await Entries.find({});
        res.render('home', { users: allUsers });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error fetching Data',
            error: error.message
        });
    }
}

// Render Entries Page (Dashboard)
export async function handleRenderEntriesPage(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user?._id) {
            res.redirect('/login');
            return;
        }

        const allUsers = await Entries.find({ 
            createdBy: new Types.ObjectId(req.user._id as string)
        });

        res.render('index', {
            users: allUsers,
            currentUser: req.user
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error fetching Data',
            error: error.message
        });
    }
}

/* Form Submission API's */
export async function handleCreateUserSSR(req: Request, res: Response): Promise<void> {
    try {
        const { fullName, email, age, gender } = req.body;

        if (!fullName || !email || !age || !gender) {
            res.redirect('/dashboard?error=invalid');
            return;
        }

        if (!req.user?._id) {
            res.redirect('/login');
            return;
        }

        const createdBy = new Types.ObjectId(req.user._id as string);
        await Entries.create({
            fullName,
            email,
            age: Number(age),
            gender,
            createdBy
        });

        res.redirect('/dashboard');
    } catch (error) {
        res.redirect('/dashboard?error=server');
    }
}

export async function handleDeleteUserSSR(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user?._id) {
            res.redirect('/login');
            return;
        }

        await Entries.findOneAndDelete({ 
            _id: req.params.id, 
            createdBy: new Types.ObjectId(req.user._id as string)
        });
        res.redirect('/dashboard');
    } catch (error) {
        res.redirect('/dashboard');
    }
}

export async function handleUpdateUserSSR(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user?._id) {
            res.redirect('/login');
            return;
        }

        await Entries.findOneAndUpdate(
            { _id: req.params.id, createdBy: new Types.ObjectId(req.user._id as string) },
            req.body,
            { new: true, runValidators: true }
        );
        res.redirect('/dashboard');
    } catch (error) {
        res.redirect('/dashboard');
    }
}

export async function handleRenderEditPage(req: Request, res: Response): Promise<void> {
    try {
        const user = await Entries.findById(req.params.id);
        if (!user) {
            res.redirect('/dashboard');
            return;
        }
        res.render('edit', { user });
    } catch {
        res.redirect('/dashboard');
    }
}
