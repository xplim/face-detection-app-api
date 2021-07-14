'use strict';

import express from 'express';
import _ from 'lodash';
import knex from 'knex';

const router = express.Router();

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

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

    db.select('*')
      .from('users')
      .where('id', id)
      .then((users) => {
        if (users.length) {
          return res.json(users[0]);
        }

        return res.status(400).json('user not found');
      })
      .catch((err) => {
        console.error(err);
        return res.status(400).json('error getting user');
      });
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

    db('users')
      .returning('*')
      .insert({
        name,
        email,
        joined: new Date(),
      })
      .then((response) => {
        return res.json(response[0]);
      })
      .catch((err) => {
        console.error(err);
        return res.status(400).json('error in registration');
      });
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
