import path from 'path';

import config from '@config';
export { insertUser, getAllUsers, EUserRole, getUserByEmail, deleteUser, getUsers } from './users';
const { db: dbConfig } = config;

console.info('connecting to db', dbConfig.database, dbConfig.host);

import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = `mongodb+srv://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/?retryWrites=true&w=majority`;

// export const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverApi: ServerApiVersion.v1,
// });
let client = null;

export const connectDb = () => {
    const client = new MongoClient(uri, {
        serverApi: ServerApiVersion.v1,
    });
    const database = client.db(dbConfig.database);
    return { database, client };
};

// export const database = client.db(dbConfig.database);

// interface IClientConnect {
//     db: any;
//     client: any;
//     error?: any;
// }

// export const connectClient = (): Promise<IClientConnect> =>
//     new Promise((resolve, reject) => {
//         client.connect((err, db) => {
//             if (err) {
//                 return reject(err);
//             }
//             const database = client.db(dbConfig.database);
//             resolve({ db: database, client } as IClientConnect);
//         });
//     });
client = new MongoClient(uri);

export const dbInit = () =>
    new Promise((resolve, reject) => {
        client.connect(async (err) => {
            if (err) {
                return reject(err);
            }
            const database = client.db(dbConfig.database);
            try {
                const users = await database.createCollection('users', {
                    validator: {
                        $jsonSchema: {
                            bsonType: 'object',
                            title: 'User Object Validation',
                            required: ['role', 'email', 'name'],
                            properties: {
                                name: {
                                    bsonType: 'string',
                                    description: "'name' must be a string and is required",
                                },
                                role: {
                                    enum: ['user', 'admin'],
                                    description: "can only be either 'user' or 'admin'",
                                },
                                email: {
                                    bsonType: 'string',
                                    description: 'must be valid email',
                                },
                                password: {
                                    bsonType: 'string',
                                },
                            },
                        },
                    },
                });
                users.createIndex({ email: 1 }, { unique: true });
            } catch (err) {
                console.log(err);
            }

            // client.close();
            resolve(null);
        });
    });
