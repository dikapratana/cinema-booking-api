function successResponse(res, { message, data = null, code = 200, meta }) {
  return res.status(code).json({
    code,
    success: true,
    message,
    data,
    meta
  })
}

function errorResponse(res, { message = 'Internal server error', data = null, code = 500 }) {
  return res.status(code).json({
    code,
    success: false,
    message,
    data
  })
}

module.exports = {
  successResponse,
  errorResponse
}
