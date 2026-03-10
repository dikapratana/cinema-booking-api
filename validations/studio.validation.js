const z = require('zod')

const getStudioSchema = z.object({
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

const createStudioSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'name is required'
          : 'name must be a string'
    })
    .trim()
    .min(1, 'name is required'),
  cinemaId: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'cinemaId is required'
          : 'cinemaId must be a string'
    })
    .trim()
    .min(1, 'name is required')
})

const updateStudioSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'name is required'
          : 'name must be a string'
    })
    .trim()
    .min(1, 'name is required'),
  cinemaId: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'cinemaId is required'
          : 'cinemaId must be a string'
    })
    .trim()
    .min(1, 'name is required')
})

const studioIdParamSchema = z.object({
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
  getStudioSchema,
  createStudioSchema,
  updateStudioSchema,
  studioIdParamSchema
}
