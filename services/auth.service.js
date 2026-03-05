const prisma = require('../config/prisma')

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email }
  })
}

module.exports = {
  findUserByEmail
}
