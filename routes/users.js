const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { getUser, updateUser } = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.get('/me', getUser);
userRoutes.patch('/me', celebrate({
  headers: Joi.object().keys({}).unknown(true),
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

exports.userRoutes = userRoutes;
