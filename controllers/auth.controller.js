const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authService = require('../services/auth.service')
const { errorResponse, successResponse } = require('../utils/response')
const { JWT_SECRET } = require('../constants/env')

function createAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  )
}

function handleInjectAdminError(res, error) {
  if (error?.code === 'ADMIN_ALREADY_EXISTS') {
    return errorResponse(res, {
      message: error.message,
      code: 409
    })
  }

  if (error?.code === 'P2002') {
    const target = String(error?.meta?.target || '')

    if (target.includes('User_email_key') || target.includes('email')) {
      return errorResponse(res, {
        message: 'Email already exists',
        code: 409
      })
    }

    if (target.includes('single_admin') || target.includes('role')) {
      return errorResponse(res, {
        message: 'Admin already exists',
        code: 409
      })
    }
  }

  return errorResponse(res, {
    message: 'Internal server error',
    code: 500
  })
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.validatedData

    const user = await authService.findUserByEmail(email)

    if (!user) {
      return errorResponse(res, { message: 'Invalid email or password', code: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return errorResponse(res, {
        message: 'Invalid email or password',
        code: 401
      })
    }

    const token = createAccessToken(user)

    return successResponse(res, {
      message: 'Login success',
      data: {
        token
      }
    })
  } catch (error) {
    return errorResponse(res, {
      message: error?.message
    })
  }
}

exports.injectAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.validatedData

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await authService.createAdmin({
      name,
      email,
      password: hashedPassword
    })

    return successResponse(res, {
      message: 'Admin injected successfully',
      data: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      },
      code: 201
    })
  } catch (error) {
    return handleInjectAdminError(res, error)
  }
}
