function successResponse(res, message, data = null, status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data
  })
}

function errorResponse(res, message, data = null, status = 500) {
  return res.status(status).json({
    success: false,
    message,
    data
  })
}