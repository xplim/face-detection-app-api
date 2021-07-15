'use strict';

export default async (db, req, res, next) => {
  try {
    const { id } = req.body;

    const entriesArray = await db('users')
      .where('id', id)
      .increment('entries', 1)
      .returning('entries');

    if (entriesArray.length) {
      return res.json(entriesArray[0]);
    }

    throw new Error(`User with id=${id} not found.`);
  } catch (err) {
    console.error(err);
    res.status(400);
    return next(new Error('Unable to get entries.'));
  }
};
