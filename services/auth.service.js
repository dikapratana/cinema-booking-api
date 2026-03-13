const prisma = require('../config/prisma')

function createAdminAlreadyExistsError() {
  const error = new Error('Admin already exists')
  error.code = 'ADMIN_ALREADY_EXISTS'
  return error
}

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email }
  })
}

async function hasAdminUser() {
  const admin = await prisma.user.findFirst({
    where: {
      role: 'ADMIN'
    },
    select: {
      id: true
    }
  })

  return Boolean(admin)
}

async function createAdmin(data) {
  const adminExists = await hasAdminUser()

  if (adminExists) {
    throw createAdminAlreadyExistsError()
  }

  return await prisma.user.create({
    data: {
      ...data,
      role: 'ADMIN'
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  })
}

module.exports = {
  findUserByEmail,
  createAdmin
}
