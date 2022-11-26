import { connectDb } from '@db';

export enum EUserRole {
    user = 'user',
    admin = 'admin',
}

export interface IUser {
    name: string;
    role: EUserRole;
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
    const users = database.collection('users');
    const result = await users.findOne({ email });
    console.log('getUserByEmail', result);
    client.close();
    return result;
};

export const insertUser = async (email, name, role: EUserRole, password) => {
    try {
        const { client, database } = connectDb();
        const users = database.collection('users');
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

export const getUsers = async () => {};
