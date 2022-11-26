import { insertUser } from '@db';
import { adminAuth, tokenAuth, createRouterEndpoint } from '@utils';
import express from 'express';
import bcrypt from 'bcrypt';
import { deleteUser, EUserRole, getAllUsers, getUsers, updateUser } from '@db';

const router = express.Router();

export enum EReportType {
    Rates = 0,
    Water = 1,
    Electricity = 2,
}

const getPermittedUsers = async (role) => {
    if (role === EUserRole.admin) {
        const users = await getAllUsers();
        return users;
    } else {
        const users = await getUsers();
        return users;
    }
};

const _updateUser = async (userId, email, name, role, password) => {
    try {
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }
        const emailLowerCase = email.toLowerCase();
        const updatedId = await updateUser(userId, emailLowerCase, name, role, hashedPassword);
        const users = await getAllUsers();
        console.log('_updateUser', updatedId);
        return {
            updatedId,
            users,
        };
    } catch (err) {
        throw err;
    }
};

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
        const users = await getAllUsers();
        console.log('addUser', result);
        return {
            deleted: result ? userId : 0,
            users,
        };
    } catch (err) {
        throw err;
    }
};

const _getUsers = async (role) => {
    const users = await getPermittedUsers(role);
    return { users };
};

router.get(
    '/',
    tokenAuth,
    createRouterEndpoint(async ({ session: { role } }) => _getUsers(role))
);

router.patch(
    '/:userId',
    adminAuth,
    createRouterEndpoint(async ({ body: { email, name, role, password }, params: { userId } }) =>
        _updateUser(userId, email, name, role, password)
    )
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
