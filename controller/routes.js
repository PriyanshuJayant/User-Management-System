const User = require('../models/Schema.js');

// GET
async function handleGetUserData(req, res) {
    const allUsers = await User.find({});
    return res.send(allUsers);
}

// POST
async function handleCreateUser(req, res) {
    const { fullName, email, age, gender } = req.body;
    if (!fullName || !email || !age || !gender) {
        return res.status(400).json({ message: "Invalid Data" });
    }
    try {
        const user = await User.create({
            fullName,
            email,
            age,
            gender
        })
        return res.status(200).json({
            message: "User Created Successfully",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error Creating User",
            error: error.message
        })
    }
}

// Get User by ID
async function handleGetUserById(req, res) {
    try {
        const userID = req.params.id;
        if (!userID) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById(userID)
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
        const user = await User.findByIdAndDelete(userID);
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
        const updateUser = await User.findByIdAndUpdate(
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
        const allUsers = await User.find({});
        return res.render('index', { users: allUsers });
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
            return res.redirect('/');
        }

        await User.create({ fullName, email, age, gender });

        return res.redirect('/');
    } catch (error) {
        return res.redirect('/?error=server');
    }
}

async function handleDeleteUserSSR(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.redirect('/');
    } catch (error) {
        return res.redirect('/');
    }
}

async function handleUpdateUserSSR(req, res) {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        return res.redirect('/');
    } catch (error) {
        return res.redirect('/');
    }
}

async function handleRenderEditPage(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.redirect('/');
        res.render('edit', { user });
    } catch {
        res.redirect('/');
    }
}


module.exports = {
    handleGetUserData,
    handleCreateUser,
    handleGetUserById,
    handleDeleteUserById,
    handleUpdateUserByID,
    handleRenderHomePage,
    handleCreateUserSSR,
    handleDeleteUserSSR,
    handleUpdateUserSSR,
    handleRenderEditPage,

}