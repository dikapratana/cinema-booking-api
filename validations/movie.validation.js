const { default: z } = require('zod')

const getAllMoviesQuerySchema = z.object({
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

const createMovieSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'title is required'
          : 'title must be a string'
    })
    .trim()
    .min(1, 'title is required'),

  description: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'description is required'
          : 'description must be a string'
    })
    .trim()
    .min(1, 'description is required'),

  duration: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'duration is required'
          : 'duration must be a string'
    })
    .regex(/^\d+$/, 'duration must be an integer')
    .transform((val) => Number(val)),

  posterUrl: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'posterUrl is required'
          : 'posterUrl must be a string'
    })
    .trim()
    .min(1, 'posterUrl is required')
    .regex(/^\/uploads\/.+$/, 'posterUrl is invalid')
}).strict()

const movieIdParamSchema = z.object({
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

const detailMovieSchema = movieIdParamSchema

const updateMovieParamSchema = movieIdParamSchema

const updateMovieSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'title is required'
          : 'title must be a string'
    })
    .trim()
    .min(1, 'title is required'),

  description: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'description is required'
          : 'description must be a string'
    })
    .trim()
    .min(1, 'description is required'),

  duration: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'duration is required'
          : 'duration must be a string'
    })
    .regex(/^\d+$/, 'duration must be an integer')
    .transform((val) => Number(val)),

  posterUrl: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'posterUrl is required'
          : 'posterUrl must be a string'
    })
    .trim()
    .min(1, 'posterUrl is required')
    .regex(/^\/uploads\/.+$/, 'posterUrl is invalid')
}).strict()

module.exports = {
  getAllMoviesQuerySchema,
  createMovieSchema,
  detailMovieSchema,
  updateMovieSchema,
  updateMovieParamSchema
}
