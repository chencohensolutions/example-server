import { createRouterEndpoint, secretAuth, validEmail } from '@utils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '@config';
const { jwtSecret } = config;
import { EUserRole, insertUser, getUserByEmail } from '@db';

import express from 'express';
const router = express.Router();

const register = async (email, name, password) => {
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = EUserRole.admin;
    const emailLowerCase = email.toLowerCase();

    if (password === '' || password.length < 6) {
        throw { code: 2, message: 'password invalid' };
    }
    if (!validEmail(emailLowerCase)) {
        throw { code: 3, message: 'email invalid' };
    }
    try {
        const result = await insertUser(emailLowerCase, name, role, hashedPassword);
        return result;
    } catch (err) {
        if (err.code) {
            throw { code: 1, message: err.message };
        }
    }
};

const loginPassword = async (loginEmail: string, loginPassword: string) => {
    try {
        let { _id, email, password, role } = await getUserByEmail(loginEmail);
        if (_id) {
            if (await bcrypt.compare(loginPassword, password)) {
                const token = jwt.sign({ email, role }, jwtSecret, { expiresIn: 60 * 60 * 24 * 30 });
                return { _id, email, password, role, token };
                // const userData = getUserData(_id);
                // if (userData) return userData;
                throw { code: 4, message: 'password incorrect' };
            } else {
                throw { code: 4, message: 'password incorrect' };
            }
        } else {
            throw { code: 5, message: 'user not exists' };
        }
    } catch (err) {
        throw err;
    }
};

enum ELoginTokenError {
    Unknown = 1,
    TokenExpired,
    TokenInvalid,
}

const getUserData = async (userEmail) => {
    let { _id, email, name, role } = await getUserByEmail(userEmail);
    if (!_id) return null;
    return {
        _id,
        email,
        name,
        role,
    };
};

const loginToken = async (loginToken: string) => {
    try {
        const { email: loginEmail } = jwt.verify(loginToken, jwtSecret);
        if (loginEmail) {
            let { _id, email, role } = await getUserByEmail(loginEmail);
            if (_id) {
                return { _id, email, role };
            } else {
                throw { code: ELoginTokenError.Unknown, message: 'unknown error' };
            }
        } else {
            throw { code: ELoginTokenError.Unknown, message: 'unknown error' };
        }
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            if (err.message === 'jwt expired') {
                throw { code: ELoginTokenError.TokenExpired, message: 'session expired' };
            }
        }
        throw err;
    }
};

router.post(
    '/register',
    secretAuth,
    createRouterEndpoint(async ({ body: { email, password, name, role } }) => register(email, name, password))
);

router.post(
    '/loginPassword',
    createRouterEndpoint(async ({ body: { email, password } }) => loginPassword(email, password))
);

router.post(
    '/loginToken',
    createRouterEndpoint(async ({ body: { token } }) => loginToken(token))
);

export default router;
