const z = require('zod')

const getCinemaSchema = z.object({
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

const createCinemaSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'name is required'
          : 'name must be a string'
    })
    .trim()
    .min(1, 'name is required'),
  address: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'address is required'
          : 'address must be a string'
    })
    .trim()
    .min(1, 'address is required')
})

const cinemaIdParamSchema = z.object({
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

const updateCinemaSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'name is required'
          : 'name must be a string'
    })
    .trim()
    .min(1, 'name is required').optional(),
  address: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'address is required'
          : 'address must be a string'
    })
    .trim()
    .min(1, 'address is required').optional()
})

module.exports = {
  createCinemaSchema,
  getCinemaSchema,
  cinemaIdParamSchema,
  updateCinemaSchema
}
