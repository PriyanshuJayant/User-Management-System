const express = require('express');
const router = express.Router();
const { handleGetUserData,
    handleCreateUser,
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
router.post('/users', handleCreateUserSSR);
router.post('/users/:id/delete', handleDeleteUserSSR);
router.post('/users/:id/update', handleUpdateUserSSR);
router.get('/users/:id/edit', handleRenderEditPage);

// SSR handlers
router.route('/')
    .get(handleRenderHomePage)

    router.route('/dashboard')
    .get(handleRenderEntriesPage)
    .post(handleCreateUserSSR)

// API handlers
router.route('/api/')
    .get(handleGetUserData)
    .post(handleCreateUser)

router.route('/api/:id')
    .get(handleGetUserById)
    .delete(handleDeleteUserById)
    .patch(handleUpdateUserByID)


module.exports = router;