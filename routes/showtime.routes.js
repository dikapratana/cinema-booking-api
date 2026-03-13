const express = require('express')
const router = express.Router()

const showTimeValidation = require('../validations/showtime.validation')
const validationMiddleware = require('../middleware/validate.middleware')
const showTimeController = require('../controllers/showtime.controller')

const { jwtAuth } = require('../middleware/auth.middleware')

router.get(
  '/',
  jwtAuth,
  validationMiddleware(showTimeValidation.getShowTimeSchema, 'query'),
  showTimeController.get
)

router.post('/', jwtAuth, validationMiddleware(showTimeValidation.createShowTimeSchema), showTimeController.create)
router.get('/:id', jwtAuth, validationMiddleware(showTimeValidation.showTimeIdParamSchema, 'params'), showTimeController.detail)
router.put(
  '/:id',
  jwtAuth,
  validationMiddleware(showTimeValidation.showTimeIdParamSchema, 'params'),
  validationMiddleware(showTimeValidation.updateShowTimeSchema),
  showTimeController.update
)
router.delete('/:id', jwtAuth, validationMiddleware(showTimeValidation.showTimeIdParamSchema, 'params'), showTimeController.delete)

module.exports = router
