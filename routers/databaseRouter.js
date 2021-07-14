'use strict';

import express from 'express';
import bcrypt from 'bcrypt';
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

const handleError = (res, err, errMessage) => {
  console.error(err);
  return res.status(400).json(errMessage);
};

export default () => {
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

  router.post('/signin', async (req, res) => {
    const handleErrorForSignIn = (err) => {
      return handleError(res, err, 'invalid combination of email and password');
    };

    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error('incorrect sign in form submission');
      }

      const loginEntries = await db
        .select('email', 'hash')
        .from('login')
        .where('email', email);

      if (loginEntries.length) {
        const hash = loginEntries[0].hash;
        await bcrypt.compare(password, hash, async (err, isValid) => {
          try {
            if (err) {
              throw new Error(err);
            }

            if (isValid) {
              const users = await db
                .select('*')
                .from('users')
                .where('email', email);
              if (users.length) {
                return res.json(users[0]);
              }
            }

            throw new Error('incorrect password');
          } catch (err) {
            return handleErrorForSignIn(err);
          }
        });
      } else {
        throw new Error('unable to get user');
      }
    } catch (err) {
      return handleErrorForSignIn(err);
    }
  });

  router.post('/register', async (req, res) => {
    const saltRounds = 10;

    const handleErrorForRegistration = (err) => {
      return handleError(res, err, 'error in registration');
    };

    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new Error('incorrect registration form submission');
      }

      await bcrypt.hash(password, saltRounds, async (err, hash) => {
        try {
          await db.transaction(async (trx) => {
            await db('login')
              .insert({
                hash,
                email,
              })
              .transacting(trx);

            const users = await db('users')
              .insert({
                name,
                email,
                joined: new Date(),
              })
              .returning('*')
              .transacting(trx);

            return res.json(users[0]);
          });
        } catch (err) {
          return handleErrorForRegistration(err);
        }
      });
    } catch (err) {
      return handleErrorForRegistration(err);
    }
  });

  router.put('/image', (req, res) => {
    const { id } = req.body;

    db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then((entriesArray) => {
        return res.json(entriesArray[0]);
      })
      .catch((err) => {
        console.error(err);
        return res.status(400).json('unable to get entries');
      });
  });

  return router;
};
