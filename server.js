'use strict';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import knex from 'knex';

import router from './router';

const PORT = 4000;

const app = express();

dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

app.use(cors());
app.use(express.json());
app.use('/', router());

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}.`);
});
