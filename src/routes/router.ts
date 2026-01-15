import express, { Router } from 'express';
import {
    handleGetUserData,
    handleGetUserById,
    handleDeleteUserById,
    handleUpdateUserByID,
    handleRenderHomePage,
    handleCreateUserSSR,
    handleDeleteUserSSR,
    handleUpdateUserSSR,
    handleRenderEditPage,
    handleRenderEntriesPage
} from '../controller/routes';
import { isAuthenticated } from '../middleware/auth';

const router: Router = express.Router();

// SSR routes
router.post('/users', isAuthenticated, handleCreateUserSSR);
router.post('/users/:id/delete', isAuthenticated, handleDeleteUserSSR);
router.post('/users/:id/update', isAuthenticated, handleUpdateUserSSR);
router.get('/users/:id/edit', isAuthenticated, handleRenderEditPage);

// SSR handlers
router.route('/')
    .get(handleRenderHomePage);

router.route('/dashboard')
    .get(isAuthenticated, handleRenderEntriesPage);

// API handlers
router.route('/api/')
    .get(isAuthenticated, handleGetUserData)
    .post(isAuthenticated, handleCreateUserSSR);

router.route('/api/:id')
    .get(isAuthenticated, handleGetUserById)
    .delete(isAuthenticated, handleDeleteUserById)
    .patch(isAuthenticated, handleUpdateUserByID);

export default router;
