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
    res.locals.message = 'Unable to work with API.';
    return next(err);
  }
};
