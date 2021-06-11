const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnouthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Ресурс не найден');
      }
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new CastError('Переданы некорректные данные');
      }
      throw err;
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Ресурс не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new CastError('Переданы некорректные данные');
      }
      throw err;
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    throw new CastError('Введите почту и пароль');
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с данным email уже существует');
      }
      return bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
          name, email, password: hash,
        }))
        .then(() => res.send({ message: 'Пользователь успешно создан!' }))
        .catch((err) => {
          if (err.name === 'CastError' || err.name === 'ValidationError') {
            throw new CastError('Переданы некорректные данные');
          }
          throw err;
        })
        .catch(next);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильный логин или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильный логин или пароль');
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  login,
  updateUser,
};
