'use strict';

import express from 'express';

import './services/ClarifaiService';

const PORT = 4000;

const app = express();

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}.`);
});
