'use strict';

import cors from 'cors';
import express from 'express';

import { corsOptions } from './config';
import routers from './routers';

const PORT = process.env.PORT ?? 4000;

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', routers());

// Error handling function.
app.use((err, req, res, next) => {
  console.error(err);

  if (res.statusCode) {
    return res.status(res.statusCode).json({
      message: err.message,
    });
  }

  return res.sendStatus(500);
});

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}.`);
});
