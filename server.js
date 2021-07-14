'use strict';

import cors from 'cors';
import express from 'express';

import routers from './routers';

const PORT = process.env.PORT ?? 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routers());

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}.`);
});
