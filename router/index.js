'use strict';

import express from 'express';

import clarifaiRouter from './clarifaiRouter';
import databaseRouter from './databaseRouter';

const router = express.Router();

export default () => {
  router.use('/', databaseRouter());
  router.use('/clarifai', clarifaiRouter());

  return router;
};
