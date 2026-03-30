const {
  z,
  paginationSchema,
  requiredTrimmedString,
  integerFromString,
  idParamSchema
} = require('./helpers')

const getStudioSchema = paginationSchema

const createStudioSchema = z.object({
  name: requiredTrimmedString('name'),
  cinemaId: requiredTrimmedString('cinemaId')
}).strict()

const updateStudioSchema = createStudioSchema.partial()
const studioIdParamSchema = idParamSchema

const generateStudioSeatsSchema = z.object({
  rows: z.array(requiredTrimmedString('rows'))
    .min(1, 'rows is required')
    .transform((rows) => rows.map((row) => row.toUpperCase()))
    .refine((rows) => new Set(rows).size === rows.length, 'rows must not contain duplicates'),
  seatsPerRow: integerFromString('seatsPerRow')
}).strict()

module.exports = {
  getStudioSchema,
  createStudioSchema,
  updateStudioSchema,
  studioIdParamSchema,
  generateStudioSeatsSchema
}
