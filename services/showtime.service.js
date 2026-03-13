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

async function getMovieAndStudio({ movieId, studioId }) {
  const [movie, studio] = await Promise.all([
    movieId
      ? prisma.movie.findUnique({
        where: {
          id: movieId
        },
        select: {
          id: true,
          duration: true
        }
      })
      : null,
    studioId
      ? prisma.studio.findUnique({
        where: {
          id: studioId
        },
        select: {
          id: true
        }
      })
      : null
  ])

  if (movieId && !movie) {
    throw createRelationNotFoundError('movieId', 'Movie not found')
  }

  if (studioId && !studio) {
    throw createRelationNotFoundError('studioId', 'Studio not found')
  }

  return {
    movie,
    studio
  }
}

async function ensureNoOverlappingShowtime({ studioId, startTime, endTime, excludeId }) {
  const existingShowtime = await prisma.showtime.findFirst({
    where: {
      studioId,
      id: excludeId ? { not: excludeId } : undefined,
      startTime: {
        lt: endTime
      },
      endTime: {
        gt: startTime
      }
    },
    select: {
      id: true
    }
  })

  if (existingShowtime) {
    throw createConflictError(
      'startTime',
      'Another showtime overlaps this studio schedule'
    )
  }
}

async function getShowTime(query) {
  return paginateQuery(prisma.showtime, {
    ...query,
    orderBy: { createdAt: 'desc' }
  })
}

async function createShowTime(data) {
  const { movie } = await getMovieAndStudio(data)

  const endTime = addMinutes(data.startTime, movie.duration)

  await ensureNoOverlappingShowtime({
    studioId: data.studioId,
    startTime: data.startTime,
    endTime
  })

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

  if (!result) {
    return null
  }

  const { cinema, ...studio } = result.studio

  return {
    ...result,
    studio,
    cinema
  }
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

  const nextMovieId = payload.movieId ?? result.movieId
  const nextStudioId = payload.studioId ?? result.studioId
  const nextStartTime = payload.startTime ?? result.startTime

  const { movie } = await getMovieAndStudio({
    movieId: nextMovieId,
    studioId: nextStudioId
  })

  const nextEndTime = addMinutes(nextStartTime, movie.duration)

  await ensureNoOverlappingShowtime({
    studioId: nextStudioId,
    startTime: nextStartTime,
    endTime: nextEndTime,
    excludeId: params?.id
  })

  const update = await prisma.showtime.update({
    where: {
      id: params?.id
    },
    data: {
      ...payload,
      endTime: nextEndTime
    }
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
