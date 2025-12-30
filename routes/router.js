const express = require('express');
const router = express.Router();
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
const { isAuthenticated, isGuest } = require('../middleware/auth.js')

// SSR routes
router.post('/users', handleCreateUserSSR);
router.post('/users/:id/delete', handleDeleteUserSSR);
router.post('/users/:id/update', handleUpdateUserSSR);
router.get('/users/:id/edit', handleRenderEditPage);

// SSR handlers
router.route('/')
    .get(handleRenderHomePage)

router.route('/dashboard')
    .get(isAuthenticated, handleRenderEntriesPage)

// API handlers
router.route('/api/')
    .get(handleGetUserData)
    .post(isAuthenticated, handleCreateUserSSR)

router.route('/api/:id')
    .get(handleGetUserById)
    .delete(handleDeleteUserById)
    .patch(handleUpdateUserByID)


module.exports = router;