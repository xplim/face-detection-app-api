'use strict';

import express from 'express';
import _ from 'lodash';

const router = express.Router();

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@example.com',
      password: 'apple',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@example.com',
      password: 'orange',
      entries: 0,
      joined: new Date(),
    },
  ],
};

const omitPassword = (obj) => {
  return _.omit(obj, ['password']);
};

export default () => {
  router.get('/', (req, res) => {
    return res.send(database.users.map((user) => omitPassword(user)));
  });

  router.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    database.users.forEach((user) => {
      if (user.id === id) {
        return res.json(omitPassword(user));
      }
    });

    return res.status(400).json('no such user');
  });

  router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    const user = database.users[0];
    if (email === user.email && password === user.password) {
      return res.json(omitPassword(user));
    }

    return res.status(400).json('error logging in');
  });

  router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    database.users.push({
      id: '125',
      name,
      email,
      password,
      entries: 0,
      joined: new Date(),
    });

    return res.json(omitPassword(database.users[database.users.length - 1]));
  });

  router.put('/image', (req, res) => {
    const { id } = req.body;

    for (const user of database.users) {
      if (user.id === id) {
        user.entries += 1;
        return res.json(user.entries);
      }
    }

    return res.status(400).json('no such user');
  });

  return router;
};
