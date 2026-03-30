const express = require('express')
const router = express.Router()

const seatValidation = require('../validations/seat.validation')
const validationMiddleware = require('../middleware/validate.middleware')
const seatController = require('../controllers/seat.controller')

const { jwtAuth } = require('../middleware/auth.middleware')

router.get(
  '/',
  jwtAuth,
  validationMiddleware(seatValidation.getSeatSchema, 'query'),
  seatController.get
)

router.get(
  '/:id',
  jwtAuth,
  validationMiddleware(seatValidation.seatIdParamSchema, 'params'),
  seatController.detail
)

module.exports = router
