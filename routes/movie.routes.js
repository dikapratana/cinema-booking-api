const express = require('express')
const router = express.Router()

const movieController = require('../controllers/movie.controller')
const movieValidation = require('../validations/movie.validation')
const validationMiddleware = require('../middleware/validate.middleware')
const { uploadPoster } = require('../middleware/upload.middleware')

router.get(
  '/',
  validationMiddleware(movieValidation.getAllMoviesQuerySchema, 'query'),
  movieController.findAll
)

router.post(
  '/',
  uploadPoster,
  validationMiddleware(movieValidation.createMovieSchema),
  movieController.create
)

router.get(
  '/:id',
  validationMiddleware(movieValidation.movieIdParamSchema, 'params'),
  movieController.detail
)

router.put('/:id',
  uploadPoster,
  validationMiddleware(movieValidation.movieIdParamSchema, 'params'),
  validationMiddleware(movieValidation.updateMovieSchema),
  movieController.update
)

router.delete(
  '/:id',
  validationMiddleware(movieValidation.movieIdParamSchema, 'params'),
  movieController.delete
)

module.exports = router
