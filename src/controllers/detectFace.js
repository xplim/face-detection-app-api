'use strict';

export default async (clarifaiApp, req, res, next) => {
  try {
    const clarifaiResponse = await clarifaiApp.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      req.body?.imageURL
    );

    if (clarifaiResponse.status.code !== 10000) {
      throw new Error(
        `Model prediction failed. Status:\n  ${response.status.description}`
      );
    }

    return res.json(clarifaiResponse);
  } catch (err) {
    console.error(err);
    res.status(400);
    return next(new Error('Unable to work with API.'));
  }
};
