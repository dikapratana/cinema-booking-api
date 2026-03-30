const prisma = require('../config/prisma')
const paginateQuery = require('../utils/paginateQuery')
const { buildUpdatePayload, isEmptyPayload } = require('../utils/updatePayload')

function createConflictError(message) {
  const error = new Error(message)
  error.code = 'STUDIO_LAYOUT_CONFLICT'
  return error
}

async function getStudio(query) {
  return paginateQuery(prisma.studio, {
    ...query,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      seatRows: true,
      seatsPerRow: true,
      cinema: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}

async function createStudio(data) {
  return await prisma.studio.create({ data })
}

async function detailStudio(params) {
  return await prisma.studio.findUnique({
    where: {
      id: params?.id
    },
    select: {
      id: true,
      name: true,
      seatRows: true,
      seatsPerRow: true,
      cinema: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
}

async function updateStudio(params, data) {
  const result = await prisma.studio.findUnique({
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

  const update = await prisma.studio.update({
    where: {
      id: params?.id
    },
    data: payload
  })

  return update
}

async function deleteStudio(params) {
  const result = await prisma.studio.findUnique({
    where: {
      id: params?.id
    }
  })

  if (!result) {
    return null
  }

  await prisma.studio.delete({
    where: {
      id: params?.id
    }
  })

  return result
}

async function generateStudioSeats(params, data) {
  const studio = await prisma.studio.findUnique({
    where: {
      id: params?.id
    },
    select: {
      id: true,
      name: true,
      seats: {
        select: {
          id: true
        },
        take: 1
      }
    }
  })

  if (!studio) {
    return null
  }

  if (studio.seats.length > 0) {
    throw createConflictError('Studio seats have already been generated')
  }

  const seats = data.rows.flatMap((rowLabel) =>
    Array.from({ length: data.seatsPerRow }, (_, index) => {
      const columnNumber = index + 1

      return {
        studioId: studio.id,
        number: `${rowLabel}${columnNumber}`,
        rowLabel,
        columnNumber
      }
    })
  )

  await prisma.$transaction([
    prisma.studio.update({
      where: {
        id: studio.id
      },
      data: {
        seatRows: data.rows,
        seatsPerRow: data.seatsPerRow
      }
    }),
    prisma.seat.createMany({
      data: seats
    })
  ])

  return {
    studioId: studio.id,
    studioName: studio.name,
    rows: data.rows,
    seatsPerRow: data.seatsPerRow,
    totalSeats: seats.length,
    preview: seats.slice(0, Math.min(5, seats.length)).map((seat) => seat.number)
  }
}

module.exports = {
  getStudio,
  createStudio,
  updateStudio,
  detailStudio,
  deleteStudio,
  generateStudioSeats
}
