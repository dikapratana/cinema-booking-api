const { z, paginationSchema, requiredTrimmedString, idParamSchema } = require('./helpers')

const getSeatSchema = paginationSchema

const createSeatSchema = z.object({
  number: requiredTrimmedString('number'),
  studioId: requiredTrimmedString('studioId')
}).strict()

const updateSeatSchema = createSeatSchema.partial()
const seatIdParamSchema = idParamSchema

module.exports = {
  getSeatSchema,
  createSeatSchema,
  updateSeatSchema,
  seatIdParamSchema
}
