const express = require('express')
const router = express.Router()
const validate = require('../middleware/validate.middleware')
const { createCinemaSchema, getCinemaSchema, cinemaIdParamSchema, updateCinemaSchema } = require('../validations/cinema.validation')
const cinemaController = require('../controllers/cinema.controller')
const { jwtAuth } = require('../middleware/auth.middleware')

router.post(
  '/',
  jwtAuth,
  validate(createCinemaSchema),
  cinemaController.create
)
router.get(
  '/',
  jwtAuth,
  validate(getCinemaSchema, 'query'),
  cinemaController.get
)

router.get(
  '/:id',
  jwtAuth,
  validate(cinemaIdParamSchema, 'params'),
  cinemaController.detail
)

router.put(
  '/:id',
  jwtAuth,
  validate(cinemaIdParamSchema, 'params'),
  validate(updateCinemaSchema),
  cinemaController.update
)

router.delete(
  '/:id',
  jwtAuth,
  validate(cinemaIdParamSchema, 'params'),
  cinemaController.delete
)

module.exports = router
