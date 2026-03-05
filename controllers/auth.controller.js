const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authService = require('../services/auth.service')
const { errorResponse, successResponse } = require('../utils/response')
const { JWT_SECRET } = require('../constants/env')
const prisma = require('../config/prisma')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.validatedData

    const user = await authService.findUserByEmail(email)
    if (!user) {
      return errorResponse(res, { message: 'Invalid email or password', code: 401 })
    }
    const isWatch = await bcrypt.compare(password, user.password)

    if (!isWatch) {
      return errorResponse(res, {
        message: 'Invalid email or password', code: 401
      })
    }

    const token = jwt.sign({
      userId: user.id,
      role: user.role
    }, JWT_SECRET, { expiresIn: '1d' })

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

    // cek apakah sudah ada admin
    const adminExist = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })

    if (adminExist) {
      return errorResponse(res, {
        message: 'Admin already exists',
        code: 409
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN'
      }
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
    console.error('inject admin error:', error)

    return errorResponse(res, {
      message: 'Internal server error',
      code: 500
    })
  }
}
