const { paginationSchema, requiredTrimmedString, idParamSchema } = require('./helpers')

const getSeatSchema = paginationSchema.extend({
  studioId: requiredTrimmedString('studioId').optional()
}).strict()

const seatIdParamSchema = idParamSchema

module.exports = {
  getSeatSchema,
  seatIdParamSchema
}
