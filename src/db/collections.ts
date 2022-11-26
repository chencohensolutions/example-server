export const Users = (db) => {
    db.createCollection('users', {
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
                        $regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        description: 'must be valid email',
                    },
                },
            },
        },
    });
    db.members.createIndex({ email: 1 }, { unique: true });
};
