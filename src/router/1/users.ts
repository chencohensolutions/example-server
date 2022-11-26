import { insertUser } from '@db';
import { adminAuth, tokenAuth, createRouterEndpoint } from '@utils';
import express from 'express';
import bcrypt from 'bcrypt';

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
            email,
            name,
            role,
        };
    } catch (err) {
        throw err;
    }
};

const getUsers = async (session) => {};

router.get(
    '/',
    tokenAuth,
    createRouterEndpoint(async ({ session }) => getUsers(session))
);

router.put(
    '/',
    adminAuth,
    createRouterEndpoint(async ({ body: { email, name, role, password } }) => addUser(email, name, role, password))
);
export default router;
