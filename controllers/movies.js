const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');

exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    movieId,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;

  return Movie.create({
    country,
    movieId,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new CastError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  return Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Ресурс не найден');
      }
      if (JSON.stringify(owner) !== JSON.stringify(movie.owner)) {
        throw new ForbiddenError('Нет прав для удаления карточки');
      }
      return Movie.remove(movie)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }))
        .catch((err) => {
          if (err.name === 'CastError' || err.name === 'ValidationError') {
            throw new CastError('Переданы некорректные данные');
          } else {
            next(err);
          }
        })
        .catch(next);
    })
    .catch(next);
};
