import { insertUser } from '@db';
import { adminAuth, tokenAuth, createRouterEndpoint } from '@utils';
import express from 'express';
import bcrypt from 'bcrypt';
import { deleteUser, EUserRole, getAllUsers, getUsers } from '@db';

const router = express.Router();

export enum EReportType {
    Rates = 0,
    Water = 1,
    Electricity = 2,
}

const addUser = async (email, name, role, password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await insertUser(email, name, role, hashedPassword);
        console.log('addUser', result);
        return {
            _id: result.insertedId,
            email,
            name,
            role,
        };
    } catch (err) {
        throw err;
    }
};

const removeUser = async (userId) => {
    try {
        const result = await deleteUser(userId);
        console.log('addUser', result);
        return {
            deleted: result ? userId : 0,
        };
    } catch (err) {
        throw err;
    }
};

const _getUsers = async (role) => {
    if (role === EUserRole.admin) {
        const users = await getAllUsers();
        return {
            users,
        };
    } else {
        const users = await getUsers();
        return {
            users,
        };
    }
};

router.get(
    '/',
    tokenAuth,
    createRouterEndpoint(async ({ session: { role } }) => _getUsers(role))
);

router.put(
    '/',
    adminAuth,
    createRouterEndpoint(async ({ body: { email, name, role, password } }) => addUser(email, name, role, password))
);

router.delete(
    '/:userId',
    adminAuth,
    createRouterEndpoint(async ({ params: { userId } }) => removeUser(userId))
);
export default router;
