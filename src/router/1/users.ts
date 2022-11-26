import { insertUser } from '@db';
import { adminAuth, tokenAuth, createRouterEndpoint } from '@utils';
import express from 'express';

const router = express.Router();

export enum EReportType {
    Rates = 0,
    Water = 1,
    Electricity = 2,
}

const addUser = async (email, name, role, password) => {
    const result = await insertUser(email, name, role, password);
    console.log('addUser', result);
    return result;
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
