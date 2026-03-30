const {
  z,
  paginationSchema,
  requiredTrimmedString,
  integerFromString,
  idParamSchema
} = require('./helpers')

const getAllMoviesQuerySchema = paginationSchema

const createMovieSchema = z.object({
  title: requiredTrimmedString('title'),
  description: requiredTrimmedString('description'),
  duration: integerFromString('duration'),
  posterUrl: requiredTrimmedString('posterUrl')
    .regex(/^\/uploads\/.+$/, 'posterUrl is invalid'),
  genreId: requiredTrimmedString('genreId')
}).strict()

const movieIdParamSchema = idParamSchema
const updateMovieSchema = createMovieSchema.partial()

module.exports = {
  getAllMoviesQuerySchema,
  createMovieSchema,
  updateMovieSchema,
  movieIdParamSchema
}
