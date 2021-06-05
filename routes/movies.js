const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const movieRoutes = express.Router();

movieRoutes.get('/', getMovies);

movieRoutes.post('/', celebrate({
  headers: Joi.object().keys({}).unknown(true),
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/https?:\/\/(w*\.)?[\d\w\-.[+()~:/\\?#\]@!$&'*,;=]{2,}#?/),
    trailer: Joi.string().required().regex(/https?:\/\/(w*\.)?[\d\w\-.[+()~:/\\?#\]@!$&'*,;=]{2,}#?/),
    thumbnail: Joi.string().required().regex(/https?:\/\/(w*\.)?[\d\w\-.[+()~:/\\?#\]@!$&'*,;=]{2,}#?/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movieRoutes.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
  headers: Joi.object().keys({}).unknown(true),
}), deleteMovie);
