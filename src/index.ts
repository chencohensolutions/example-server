import 'module-alias/register';
import 'source-map-support/register';
import appRouter from './router';
import express from 'express';
import config from '@config';
import { dbInit } from '@db';

import cors from 'cors';

const { accessControlAllowOrigin } = config;
console.log('accessControlAllowOrigin', accessControlAllowOrigin);

const port = process.env.PORT || 3040;

const app = express();

app.use(
    cors({
        origin: accessControlAllowOrigin,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-type,Authorization',
        credentials: true,
    })
);

app.use(express.json());

app.use('/', appRouter);

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

const boot = async () => {
    try {
        await dbInit();
    } catch (err) {
        console.log(err);
    }
    app.listen(port, () => {
        console.info(`server is listening on ${port}`);
    });
};

boot();
