const { z, requiredTrimmedString } = require('./helpers')
const { EMAIL_REGEX } = require('../constants/regex')

const loginSchema = z.object({
  email: requiredTrimmedString('email')
    .regex(EMAIL_REGEX, 'email must be valid'),
  password: requiredTrimmedString('password')
}).strict()

const injectAdminSchema = z.object({
  name: requiredTrimmedString('name'),
  email: requiredTrimmedString('email')
    .regex(EMAIL_REGEX, 'email must be valid'),
  password: requiredTrimmedString('password')
}).strict()

module.exports = {
  loginSchema,
  injectAdminSchema
}
