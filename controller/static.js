const Entries = require('../models/Schema.js')

async function handleRender_Login(req, res) {
    return res.render('login.ejs');
}

async function handleRender_Signup(req, res) {
    return res.render('signup.ejs');
}

async function handleUser_Login(req, res) {

}

async function handleUser_Signup(req, res) {

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