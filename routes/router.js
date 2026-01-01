const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth.js');
const { handleGetUserData,
    handleGetUserById,
    handleDeleteUserById,
    handleUpdateUserByID,
    handleRenderHomePage,
    handleCreateUserSSR,
    handleDeleteUserSSR,
    handleUpdateUserSSR,
    handleRenderEditPage,
    handleRenderEntriesPage
} = require('../controller/routes.js')

// SSR routes
router.post('/users', isAuthenticated, handleCreateUserSSR);
router.post('/users/:id/delete', isAuthenticated, handleDeleteUserSSR);
router.post('/users/:id/update', isAuthenticated, handleUpdateUserSSR);
router.get('/users/:id/edit', isAuthenticated, handleRenderEditPage);

// SSR handlers
router.route('/')
    .get(handleRenderHomePage)

router.route('/dashboard')
    .get(isAuthenticated, handleRenderEntriesPage) // Needs Auth Check

// API handlers
router.route('/api/')
    .get(isAuthenticated, handleGetUserData)
    .post(isAuthenticated, handleCreateUserSSR)  // Needs Auth Check
router.route('/api/:id')
    .get(isAuthenticated, handleGetUserById)
    .delete(isAuthenticated, handleDeleteUserById)
    .patch(isAuthenticated, handleUpdateUserByID)


module.exports = router;