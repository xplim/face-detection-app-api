'use strict';

import express from 'express';
import knex from 'knex';

import { dbConnectionOptions } from '../config';
import getProfile from '../controllers/getProfile';
import incrementEntries from '../controllers/incrementEntries';
import register from '../controllers/register';
import signIn from '../controllers/signIn';

const router = express.Router();

const db = knex({
  client: 'pg',
  connection: dbConnectionOptions,
});

// Smoke test.
db.raw('SELECT 1')
  .then(() => {
    console.log('Connection to database SUCCESSFUL.');
  })
  .catch((err) => {
    console.error('Connection to database FAILED.');
  });

export default () => {
  router.get('/profile/:id', async (req, res, next) => {
    await getProfile(db, req, res, next);
  });

  router.post('/signin', async (req, res, next) => {
    await signIn(db, req, res, next);
  });

  router.post('/register', async (req, res, next) => {
    await register(db, req, res, next);
  });

  router.put('/image', async (req, res, next) => {
    await incrementEntries(db, req, res, next);
  });

  return router;
};
