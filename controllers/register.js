'use strict';

import bcrypt from 'bcrypt';

const saltRounds = 10;

const handleError = (err, res, next) => {
  res.locals.message = 'Unable to register.';
  return next(err);
};

export default async (db, req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error('Empty fields in registration form.');
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
        return handleError(err, res, next);
      }
    });
  } catch (err) {
    return handleError(err, res, next);
  }
};
