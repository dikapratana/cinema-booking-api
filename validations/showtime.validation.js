const {
  z,
  paginationSchema,
  requiredTrimmedString,
  decimalFromString,
  dateTimeFromString,
  idParamSchema
} = require('./helpers')

const getShowTimeSchema = paginationSchema

const createShowTimeSchema = z.object({
  movieId: requiredTrimmedString('movieId'),
  studioId: requiredTrimmedString('studioId'),
  price: decimalFromString('price'),
  startTime: dateTimeFromString('startTime')
}).strict()

const updateShowTimeSchema = createShowTimeSchema.partial()
const showTimeIdParamSchema = idParamSchema

module.exports = {
  getShowTimeSchema,
  createShowTimeSchema,
  updateShowTimeSchema,
  showTimeIdParamSchema
}
