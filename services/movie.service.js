const prisma = require("../config/prisma");
const { buildPagination } = require("../utils/pagination");

async function createMovie(data) {
  return await prisma.movie.create({ data });
}

async function getAllMovies({ page, size }) {
  const skip = (page - 1) * size;

  const [data, totalData] = await Promise.all([
    prisma.movie.findMany({
      skip,
      take: size,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.movie.count(),
  ]);

  const meta = buildPagination({
    page, size, totalData, totalDataOnPage: data.length
  })

  return {
    data,
    meta
  }
}

module.exports = {
  createMovie,
  getAllMovies,
};
