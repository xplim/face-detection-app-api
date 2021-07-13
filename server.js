'use strict';

import express from 'express';

import router from './router';

const PORT = 4000;

const app = express();

app.use(express.json());
app.use('/', router());

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}.`);
});
