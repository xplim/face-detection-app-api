'use strict';

import express from 'express';
import Clarifai from 'clarifai';

const router = express.Router();

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY,
});

export default () => {
  router.post('/face-detection', (req, res) => {
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body?.imageURL)
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json('Unable to work with API'));
  });

  return router;
};
