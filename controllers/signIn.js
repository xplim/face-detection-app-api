'use strict';

import bcrypt from 'bcrypt';

const handleError = (err, res, next) => {
  res.locals.message = 'Invalid combination of email and password.';
  return next(err);
};

export default async (db, req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error('Empty fields in sign in form.');
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

          throw new Error(`Incorrect password for ${email}.`);
        } catch (err) {
          return handleError(err, res, next);
        }
      });
    } else {
      throw new Error(`User with email=${email} not found.`);
    }
  } catch (err) {
    return handleError(err, res, next);
  }
};
