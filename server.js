'use strict';

import cors from 'cors';
import express from 'express';

import routers from './routers';

const PORT = process.env.PORT ?? 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routers());

// Error handling function.
app.use((err, req, res, next) => {
  console.error('GENERIC:', res.locals.message);
  console.error('ACTUAL:', err);
  return res.status(400).json(res.locals.message);
});

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}.`);
});
