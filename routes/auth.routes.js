const express = require('express')
const router = express.Router()

const validationMiddleware = require('../middleware/validate.middleware')
const { loginSchema, injectAdminSchema } = require('../validations/auth.validation')
const { login, injectAdmin } = require('../controllers/auth.controller')
const { basicAuth } = require('../middleware/auth.middleware')

router.post(
  '/login',
  basicAuth,
  validationMiddleware(loginSchema),
  login
)

router.post(
  '/inject-admin',
  basicAuth,
  validationMiddleware(injectAdminSchema),
  injectAdmin
)

module.exports = router
