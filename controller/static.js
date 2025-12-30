const User = require('../models/Users.js')

async function handleRender_Login(req, res) {
    return res.render('login.ejs');
}

async function handleRender_Signup(req, res) {
    return res.render('signup.ejs');
}

async function handleUser_Signup(req, res) {
    try {
        const { name, email, password } = req.body;
        await User.create({ name, email, password });
        console.log(name, email, password);
        return res.redirect('/login');
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
        // return res.redirect('/signup');
    }
}

async function handleUser_Login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.render("signup",({ message: "Email and password are required" }))

        const user = await User.findOne({ email, password });
        if (!user)
            return res.render("login",({ message: "User not found" })); 


        

        return res.redirect("/dashboard");
        
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

async function handleUser_Logout(req, res) {

}



module.exports = {
    handleUser_Login,
    handleUser_Signup,
    handleUser_Logout,
    handleRender_Login,
    handleRender_Signup
}