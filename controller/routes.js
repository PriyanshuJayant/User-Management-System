const Entries = require('../models/Schema.js');

// GET
async function handleGetUserData(req, res) {
    const allUsers = await Entries.find({});
    return res.send(allUsers);
}

// Get User by ID
async function handleGetUserById(req, res) {
    try {
        const userID = req.params.id;
        if (!userID) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await Entries.findById(userID)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: "Error Finding User",
            error: error.message
        })
    }
}

// Delete User by ID
async function handleDeleteUserById(req, res) {
    try {
        const userID = req.params.id;
        if (!userID) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await Entries.findByIdAndDelete(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(202).json({
            message: 'User Deleted Successfully',
            id: userID
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error Finding User",
            error: error.message
        })
    }
}

// Patch User by ID
async function handleUpdateUserByID(req, res) {
    try {
        const userID = req.params.id;
        if (!userID) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const update = req.body;
        if (!Object.keys(update).length) {
            return res.status(400).json({ message: 'No update Data Provided' });
        }
        const updateUser = await Entries.findByIdAndUpdate(
            userID,
            update,
            { new: true, runValidators: true }
        )

        if (!updateUser) {
            return res.status(404).json({ message: 'User not Found' });
        }
        return res.json({
            message: 'User Updated',
            updateUser
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error Finding User",
            error: error.message
        })
    }
}

// Render Home Page with all Users
async function handleRenderHomePage(req, res) {
    try {
        const allUsers = await Entries.find({});
        return res.render('home', { users: allUsers });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching Data',
            error: error
        })
    }
}
async function handleRenderEntriesPage(req, res) {
    try {
        const allUsers = await Entries.find({ createdBy: req.user?._id });

        return res.render('index', {
            users: allUsers,
            currentUser: req.user
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching Data',
            error: error
        })
    }
}


/* Form Submission API's */
async function handleCreateUserSSR(req, res) {
    try {
        const { fullName, email, age, gender } = req.body;

        if (!fullName || !email || !age || !gender) {
            return res.redirect('/dashboard?error=invalid');
        }

        const createdBy = req.user?._id;
        await Entries.create({
            fullName,
            email,
            age,
            gender,
            createdBy
        });

        return res.redirect('/dashboard');
    } catch (error) {
        return res.redirect('/dashboard?error=server');
    }
}

async function handleDeleteUserSSR(req, res) {
    try {
        await Entries.findByIdAndDelete({ _id: req.params.id, createdBy: req.user?._id });
        return res.redirect('/dashboard');
    } catch (error) {
        return res.redirect('/dashboard');
    }
}

async function handleUpdateUserSSR(req, res) {
    try {
        await Entries.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, createdBy: req.user?._id });
        return res.redirect('/dashboard');
    } catch (error) {
        return res.redirect('/dashboard');
    }
}

async function handleRenderEditPage(req, res) {
    try {
        const user = await Entries.findById(req.params.id);
        if (!user) return res.redirect('/dashboard');
        res.render('edit', { user });
    } catch {
        res.redirect('/dashboard');
    }
}


module.exports = {
    handleGetUserData,
    handleGetUserById,
    handleDeleteUserById,
    handleUpdateUserByID,
    handleRenderHomePage,
    handleCreateUserSSR,
    handleDeleteUserSSR,
    handleUpdateUserSSR,
    handleRenderEditPage,
    handleRenderEntriesPage,
}