const { z, paginationSchema, requiredTrimmedString, idParamSchema } = require('./helpers')

const getStudioSchema = paginationSchema

const createStudioSchema = z.object({
  name: requiredTrimmedString('name'),
  cinemaId: requiredTrimmedString('cinemaId')
}).strict()

const updateStudioSchema = createStudioSchema.partial()
const studioIdParamSchema = idParamSchema

module.exports = {
  getStudioSchema,
  createStudioSchema,
  updateStudioSchema,
  studioIdParamSchema
}
