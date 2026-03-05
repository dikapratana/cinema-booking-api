const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/response')

function jwtAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, {
      message: 'Unauthorized',
      code: 401
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = decoded

    next()
  } catch (err) {
    return errorResponse(res, {
      message: 'Invalid token',
      code: 401
    })
  }
}

function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return errorResponse(res, {
      message: 'Unauthorized',
      code: 401
    })
  }

  const base64Credentials = authHeader.split(' ')[1]

  const credentials = Buffer
    .from(base64Credentials, 'base64')
    .toString('utf8')

  const [username, password] = credentials.split(':')

  if (
    username !== process.env.BASIC_AUTH_USERNAME ||
    password !== process.env.BASIC_AUTH_PASSWORD
  ) {
    return errorResponse(res, {
      message: 'Invalid credentials',
      code: 401
    })
  }

  next()
}

module.exports = {
  jwtAuth,
  basicAuth
}
