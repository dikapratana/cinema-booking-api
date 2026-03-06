const prisma = require('../config/prisma')
const paginateQuery = require('../utils/paginateQuery')
const { buildUpdatePayload, isEmptyPayload } = require('../utils/updatePayload')

async function createCinema(data) {
  return await prisma.cinema.create({ data })
}

async function getCinema(query) {
  return paginateQuery(prisma.cinema, {
    ...query,
    orderBy: { createdAt: 'desc' }
  })
}

async function detailCinema(params) {
  return await prisma.cinema.findUnique({ where: { id: params?.id } })
}

async function updateCinema(params, data) {
  const result = await prisma.cinema.findUnique({
    where: {
      id: params?.id
    }
  })

  if (!result) {
    return null
  }

  const payload = buildUpdatePayload(data)

  if (isEmptyPayload(payload)) {
    return result
  }

  const update = await prisma.cinema.update({
    where: {
      id: params?.id
    },
    data: payload
  })

  return update
}

async function deleteCinema(params) {
  const result = await prisma.cinema.findUnique({
    where: {
      id: params?.id
    }
  })

  if (!result) {
    return null
  }

  await prisma.cinema.delete({
    where: {
      id: params?.id
    }
  })

  return result
}

module.exports = {
  createCinema,
  getCinema,
  detailCinema,
  updateCinema,
  deleteCinema
}
