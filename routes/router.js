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
    handleRenderEditPage
} = require('../controller/routes.js')


router.post('/users', handleCreateUserSSR);
router.post('/users/:id/delete', handleDeleteUserSSR);
router.post('/users/:id/update', handleUpdateUserSSR);
router.get('/users/:id/edit', handleRenderEditPage);

// handlers
router.route('/')
    .get(handleRenderHomePage)
    .post(handleCreateUserSSR)

router.route('/api/')
    .get(handleGetUserData)
    .post(handleCreateUser)

router.route('/api/:id')
    .get(handleGetUserById)
    .delete(handleDeleteUserById)
    .patch(handleUpdateUserByID)


module.exports = router;