'use strict';

import express from 'express';
import Clarifai from 'clarifai';

import detectFace from '../controllers/detectFace';

const router = express.Router();

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
});

export default () => {
  router.post('/face-detection', async (req, res, next) => {
    await detectFace(clarifaiApp, req, res, next);
  });

  return router;
};
