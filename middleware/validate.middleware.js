const { errorResponse } = require('../utils/response')

const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source])

  if (!result.success) {
    const issues = result.error.issues || []

    const idErrorFromParams =
      source === 'params' &&
      issues.length === 1 &&
      issues[0]?.path?.[0] === 'id'

    if (idErrorFromParams) {
      const rawId = req.params?.id
      const normalizedId = typeof rawId === 'string' ? rawId.trim().toLowerCase() : rawId
      const isMissingId =
        rawId === undefined ||
        normalizedId === '' ||
        normalizedId === 'undefined' ||
        normalizedId === 'null' ||
        normalizedId === ':id'

      return res.status(422).json({
        code: 422,
        success: false,
        message: isMissingId ? 'id is required' : (issues[0]?.message || 'Invalid id')
      })
    }

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
