import express from 'express';
import usersRoutes from './users';
import loginRoutes from './login';

import { userAuth, adminAuth } from '@utils';
const router = express.Router();

router.use('/', loginRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminAuth, usersRoutes);

export default router;
