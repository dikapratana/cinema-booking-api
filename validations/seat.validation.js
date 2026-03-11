const z = require('zod')

const getSeatSchema = z.object({
  page: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'page is required'
          : 'page must be a string'
    })
    .regex(/^\d+$/, 'page must be an integer')
    .transform(Number)
    .refine((value) => value >= 1, 'page must be at least 1'),
  size: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'size is required'
          : 'size must be a string'
    })
    .regex(/^\d+$/, 'size must be an integer')
    .transform(Number)
    .refine((value) => value >= 1, 'size must be at least 1')
    .refine((value) => value <= 100, 'size must be at most 100')
}).strict()

const createSeatSchema = z.object({
  number: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'number is required'
          : 'number must be a string'
    })
    .trim()
    .min(1, 'number is required'),
  studioId: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'studioId is required'
          : 'studioId must be a string'
    })
    .trim()
    .min(1, 'studioId is required')
})

const updateSeatSchema = z.object({
  number: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'number is required'
          : 'number must be a string'
    })
    .trim()
    .min(1, 'number is required')
    .regex(/^\d+$/, 'number must contain digits only'),
  studioId: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'studioId is required'
          : 'studioId must be a string'
    })
    .trim()
    .min(1, 'number is required')
})

const seatIdParamSchema = z.object({
  id: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'id is required'
          : 'id must be a string'
    })
    .trim()
    .min(1, 'id is required')
    .refine((value) => {
      const normalized = value.toLowerCase()
      return normalized !== 'undefined' && normalized !== 'null' && normalized !== ':id'
    }, 'id is required')
}).strict()

module.exports = {
  getSeatSchema,
  createSeatSchema,
  updateSeatSchema,
  seatIdParamSchema
}
