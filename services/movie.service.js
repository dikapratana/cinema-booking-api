const prisma = require('../config/prisma')
const paginateQuery = require('../utils/paginateQuery')
const { buildUpdatePayload, isEmptyPayload } = require('../utils/updatePayload')
const { replaceLocalUpload, unlinkFile } = require('../utils/uploadFile')

async function getAllMovies(query) {
  return paginateQuery(prisma.movie, {
    ...query,
    orderBy: { createdAt: 'desc' }
  })
}

async function createMovie(data) {
  return await prisma.movie.create({ data })
}

async function detailMovie(params) {
  return await prisma.movie.findUnique({
    where: {
      id: params.id
    }
  })
}

async function updateMovie(params, data) {
  const movie = await prisma.movie.findUnique({
    where: {
      id: params.id
    }
  })

  if (!movie) {
    return null
  }

  const payload = buildUpdatePayload(data)
  if (isEmptyPayload(payload)) {
    return movie
  }

  const updatedMovie = await prisma.movie.update({
    where: {
      id: params.id
    },
    data: payload
  })

  await replaceLocalUpload(movie.posterUrl, payload.posterUrl)

  return updatedMovie
}

async function deleteMovie(params) {
  const movie = await prisma.movie.findUnique({
    where: {
      id: params.id
    }
  })

  if (!movie) {
    return null
  }

  await prisma.movie.delete({
    where: {
      id: params.id
    }
  })

  await unlinkFile(movie.posterUrl)

  return movie
}

module.exports = {
  getAllMovies,
  createMovie,
  detailMovie,
  updateMovie,
  deleteMovie
}
