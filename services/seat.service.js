const prisma = require('../config/prisma')
const paginateQuery = require('../utils/paginateQuery')
const { buildUpdatePayload, isEmptyPayload } = require('../utils/updatePayload')

async function getSeat(query) {
  return paginateQuery(prisma.seat, {
    ...query,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      number: true,
      studio: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}

async function createSeat(data) {
  return await prisma.seat.create({ data })
}

async function detailSeat(params) {
  const result = await prisma.seat.findUnique({
    where: {
      id: params?.id
    }
  })

  return result
}

async function updateSeat(params, data) {
  const result = await prisma.seat.findUnique({
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

  const update = await prisma.seat.update({
    where: {
      id: params?.id
    },
    data: payload
  })

  return update
}

async function deleteSeat(params) {
  const result = await prisma.seat.findUnique({
    where: {
      id: params.id
    }
  })

  if (!result) {
    return null
  }

  await prisma.seat.delete({
    where: {
      id: params.id
    }
  })

  return result
}

module.exports = {
  getSeat,
  createSeat,
  updateSeat,
  detailSeat,
  deleteSeat
}
