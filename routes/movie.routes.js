const express = require('express')
const router = express.Router()

const movieController = require('../controllers/movie.controller')
const movieValidation = require('../validations/movie.validation')
const validationMiddleware = require('../middleware/validate.middleware')
const { uploadPoster } = require('../middleware/upload.middleware')
const { jwtAuth } = require('../middleware/auth.middleware')
router.get(
  '/',
  jwtAuth,
  validationMiddleware(movieValidation.getAllMoviesQuerySchema, 'query'),
  movieController.findAll
)

router.post(
  '/',
  jwtAuth,
  uploadPoster,
  validationMiddleware(movieValidation.createMovieSchema),
  movieController.create
)

router.get(
  '/:id',
  jwtAuth,
  validationMiddleware(movieValidation.movieIdParamSchema, 'params'),
  movieController.detail
)

router.put('/:id',
  jwtAuth,
  uploadPoster,
  validationMiddleware(movieValidation.movieIdParamSchema, 'params'),
  validationMiddleware(movieValidation.updateMovieSchema),
  movieController.update
)

router.delete(
  '/:id',
  jwtAuth,
  validationMiddleware(movieValidation.movieIdParamSchema, 'params'),
  movieController.delete
)

module.exports = router
