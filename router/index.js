'use strict';

import express from 'express';

import clarifaiRouter from './clarifaiRouter';

const router = express.Router();

export default () => {
  router.use('/clarifai', clarifaiRouter());

  return router;
};
