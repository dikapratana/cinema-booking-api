const express = require('express')
const router = express.Router()

const studioValidation = require('../validations/studio.validation')
const validationMiddleware = require('../middleware/validate.middleware')
const studioController = require('../controllers/studio.controller')

const { jwtAuth } = require('../middleware/auth.middleware')

router.get(
  '/',
  jwtAuth,
  validationMiddleware(studioValidation.getStudioSchema, 'query'),
  studioController.get
)

router.post('/', jwtAuth, validationMiddleware(studioValidation.createStudioSchema), studioController.create)

router.post(
  '/:id/seats/generate',
  jwtAuth,
  validationMiddleware(studioValidation.studioIdParamSchema, 'params'),
  validationMiddleware(studioValidation.generateStudioSeatsSchema),
  studioController.generateSeats
)

router.get(
  '/:id',
  jwtAuth,
  validationMiddleware(studioValidation.studioIdParamSchema, 'params'),
  studioController.detail
)

router.put(
  '/:id',
  jwtAuth,
  validationMiddleware(studioValidation.studioIdParamSchema, 'params'),
  validationMiddleware(studioValidation.updateStudioSchema), studioController.update)

router.delete(
  '/:id',
  jwtAuth,
  validationMiddleware(studioValidation.studioIdParamSchema, 'params'),
  studioController.delete
)

module.exports = router
