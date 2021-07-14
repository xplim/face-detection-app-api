'use strict';

import express from 'express';

import clarifaiRouter from './clarifaiRouter';
import databaseRouter from './databaseRouter';

const routers = express.Router();

export default () => {
  routers.use('/', databaseRouter());
  routers.use('/clarifai', clarifaiRouter());

  return routers;
};
