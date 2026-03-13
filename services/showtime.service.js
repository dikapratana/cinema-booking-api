const prisma = require('../config/prisma')
const paginateQuery = require('../utils/paginateQuery')
const { buildUpdatePayload, isEmptyPayload } = require('../utils/updatePayload')

function createRelationNotFoundError(field, message) {
  const error = new Error(message)
  error.code = 'RELATION_NOT_FOUND'
  error.field = field
  return error
}

function createConflictError(field, message) {
  const error = new Error(message)
  error.code = 'SHOWTIME_CONFLICT'
  error.field = field
  return error
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + (minutes * 60 * 1000))
}

async function getShowTime(query) {
  return paginateQuery(prisma.showtime, {
    ...query,
    orderBy: { createdAt: 'desc' }
  })
}

async function createShowTime(data) {
  const [movie, studio] = await Promise.all([
    prisma.movie.findUnique({
      where: {
        id: data.movieId
      },
      select: {
        id: true,
        duration: true
      }
    }),
    prisma.studio.findUnique({
      where: {
        id: data.studioId
      },
      select: {
        id: true
      }
    })
  ])

  if (!movie) {
    throw createRelationNotFoundError('movieId', 'Movie not found')
  }

  if (!studio) {
    throw createRelationNotFoundError('studioId', 'Studio not found')
  }

  const endTime = addMinutes(data.startTime, movie.duration)

  const existingShowtime = await prisma.showtime.findFirst({
    where: {
      studioId: data.studioId,
      startTime: {
        lt: endTime
      },
      endTime: {
        gt: data.startTime
      }
    },
    select: {
      id: true,
      startTime: true,
      endTime: true
    }
  })

  if (existingShowtime) {
    throw createConflictError(
      'startTime',
      'Another showtime overlaps this studio schedule'
    )
  }

  return await prisma.showtime.create({
    data: {
      ...data,
      endTime
    }
  })
}

async function detailShowTime(params) {
  const result = await prisma.showtime.findUnique({
    where: {
      id: params?.id
    },
    select: {
      id: true,
      price: true,
      startTime: true,
      endTime: true,
      movie: {
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          posterUrl: true
        }
      },
      studio: {
        select: {
          id: true,
          name: true,
          cinema: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })

  const mapResult = {
    ...result,
    cinema: result.studio.cinema
  }
  delete result.studio.cinema

  return mapResult
}

async function updateShowTime(params, data) {
  const result = await prisma.showtime.findUnique({
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

  const update = await prisma.showtime.update({
    where: {
      id: params?.id
    },
    data: payload
  })

  return update
}

async function deleteShowTime(params) {
  const result = await prisma.showtime.findUnique({
    where: {
      id: params.id
    }
  })

  if (!result) {
    return null
  }

  await prisma.showtime.delete({
    where: {
      id: params.id
    }
  })

  return result
}

module.exports = {
  getShowTime,
  createShowTime,
  detailShowTime,
  updateShowTime,
  deleteShowTime
}
