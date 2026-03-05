const prisma = require('../config/prisma')
const paginateQuery = require('../utils/paginateQuery')

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

  return await prisma.movie.update({
    where: {
      id: params.id
    },
    data
  })
}

module.exports = {
  getAllMovies,
  createMovie,
  detailMovie,
  updateMovie
}
