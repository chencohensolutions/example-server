import { connectDb } from '@db';
import { ObjectId } from 'mongodb';

export enum EUserRole {
    user = 'user',
    admin = 'admin',
}

export interface IUser {
    _id: string;
    name: string;
    role: EUserRole;
    password: string;
    email: string;
}

// export const insertUser = async (
//     email: string,
//     hashedPassword: string,
//     firtsName: string,
//     lastName: string,
//     role: EUserRole
// ) => {
//     const result = await dbQuery(
//         `INSERT INTO users(email, password, first_name, last_name, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
//         [email, hashedPassword, firtsName, lastName, role]
//     );
//     return result[0];
// };

// export const getUserById = async (id: string) => {
//     const result = await dbQuery(`SELECT id, email, first_name, last_name, role, password FROM users WHERE id=$1`, [
//         id,
//     ]);
//     return result[0];
// };

export const getUserByEmail = async (email: string) => {
    const { client, database } = connectDb();
    const users = database.collection<IUser>('users');
    const result = await users.findOne({ email });
    console.log('getUserByEmail', result);
    client.close();
    return result;
};

export const deleteUser = async (userId) => {
    try {
        const { client, database } = connectDb();
        const users = database.collection('users');
        const result = await users.deleteOne({
            _id: new ObjectId(userId),
        });
        console.log(`A document was inserted with the _id: ${result.deletedCount}`);
        client.close();
        return result.deletedCount;
    } finally {
    }
};

export const insertUser = async (email, name, role: EUserRole, password) => {
    try {
        const { client, database } = connectDb();
        const users = database.collection('users');
        const cursor = users.find<IUser>(
            { runtime: { $lt: 15 } },
            {
                sort: { title: 1 },
                projection: { _id: 0, title: 1, imdb: 1 },
            }
        );
        const result = await users.insertOne({
            email,
            name,
            role,
            password,
        });
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        client.close();
        return result;
    } finally {
    }
};

export const getAllUsers = async () => {
    try {
        const { client, database } = connectDb();
        const users = database.collection('users');
        const cursor = users.find<IUser>(
            {},
            {
                sort: { name: 1 },
                projection: { _id: 1, name: 1, email: 1, role: 1 },
            }
        );
        const result = [];
        await cursor.forEach((record) => {
            console.log(record);
            result.push(record);
        });

        // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        client.close();
        return result;
    } finally {
    }
};

export const getUsers = async () => {
    try {
        const { client, database } = connectDb();
        const users = database.collection('users');
        const cursor = users.find<IUser>(
            {
                role: EUserRole.user,
            },
            {
                sort: { name: 1 },
                projection: { _id: 1, name: 1, email: 1, role: 1 },
            }
        );
        const result = [];
        await cursor.forEach((record) => {
            console.log(record);
            result.push(record);
        });

        // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        client.close();
        return result;
    } finally {
    }
};
