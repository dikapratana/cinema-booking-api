const { z } = require('zod')
const { EMAIL_REGEX } = require('../constants/regex')

const loginSchema = z.object({
  email: z.string({
    error: (issue) =>
      issue.input === undefined
        ? 'email is required'
        : 'email must be a string'
  })
    .trim()
    .min(1, 'email is required').regex(EMAIL_REGEX, 'email mus be valid'),
  password: z.string({
    error: (issue) =>
      issue.input === undefined
        ? 'password is required'
        : 'password must be a string'
  })
    .trim()
    .min(1, 'password is required')
})

const injectAdminSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined
        ? 'name is required'
        : 'name must be a string'
  })
    .trim()
    .min(1, 'name is required'),

  email: z.string({
    error: (issue) =>
      issue.input === undefined
        ? 'email is required'
        : 'email must be a string'
  })
    .trim()
    .min(1, 'email is required').regex(EMAIL_REGEX, 'email mus be valid'),
  password: z.string({
    error: (issue) =>
      issue.input === undefined
        ? 'password is required'
        : 'password must be a string'
  })
    .trim()
    .min(1, 'password is required')
}).strict()

module.exports = {
  loginSchema,
  injectAdminSchema
}
