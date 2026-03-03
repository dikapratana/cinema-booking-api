const { errorResponse } = require('../utils/response')

const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source])

  if (!result.success) {
    const issues = result.error.issues || []
    const formattedErrors = issues.flatMap((issue) => {
      if (issue.code === 'unrecognized_keys' && issue.keys?.length) {
        return issue.keys.map((key) => ({
          field: key,
          message: `Parameter '${key}' is not allowed`
        }))
      }

      return [{
        field: issue.path[0] || source,
        message: issue.message
      }]
    })

    return errorResponse(res, {
      message: 'Validation error',
      code: 422,
      data: formattedErrors
    })
  }

  req.validated = req.validated || {}
  req.validated[source] = result.data
  req.validatedData = result.data
  next()
}

module.exports = validate
