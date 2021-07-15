'use strict';

export default async (db, req, res, next) => {
  try {
    const { id } = req.params;

    const users = await db.select('*').from('users').where('id', id);

    if (users.length) {
      return res.json(users[0]);
    }

    throw new Error(`User with id=${id} not found.`);
  } catch (err) {
    console.error(err);
    res.status(400);
    return next(new Error('Unable to get user.'));
  }
};
