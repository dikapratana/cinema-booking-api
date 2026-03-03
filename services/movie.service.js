const prisma = require("../config/prisma");
const paginateQuery = require("../utils/paginateQuery");

async function createMovie(data) {
  return await prisma.movie.create({ data });
}

async function getAllMovies(query) {
  return paginateQuery(prisma.movie, {
    ...query,
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  createMovie,
  getAllMovies,
};
