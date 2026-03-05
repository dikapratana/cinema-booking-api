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
  validationMiddleware(movieValidation.detailMovieSchema, 'params'),
  movieController.detail
)

router.put('/:id',
  uploadPoster,
  validationMiddleware(movieValidation.updateMovieParamSchema, 'params'),
  validationMiddleware(movieValidation.updateMovieSchema),
  movieController.update
)

module.exports = router
