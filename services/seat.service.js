const prisma = require('../config/prisma')
const paginateQuery = require('../utils/paginateQuery')

async function getSeat(query) {
  return paginateQuery(prisma.seat, {
    page: query.page,
    size: query.size,
    where: {
      studioId: query.studioId
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      number: true,
      rowLabel: true,
      columnNumber: true,
      studio: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}

async function detailSeat(params) {
  return await prisma.seat.findUnique({
    where: {
      id: params?.id
    },
    select: {
      id: true,
      number: true,
      rowLabel: true,
      columnNumber: true,
      studio: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}

module.exports = {
  getSeat,
  detailSeat
}
