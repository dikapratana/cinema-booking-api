const { z, paginationSchema, requiredTrimmedString, idParamSchema } = require('./helpers')

const getCinemaSchema = paginationSchema

const createCinemaSchema = z.object({
  name: requiredTrimmedString('name'),
  address: requiredTrimmedString('address')
}).strict()

const cinemaIdParamSchema = idParamSchema
const updateCinemaSchema = createCinemaSchema.partial()

module.exports = {
  createCinemaSchema,
  getCinemaSchema,
  cinemaIdParamSchema,
  updateCinemaSchema
}
