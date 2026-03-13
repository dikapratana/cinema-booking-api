const { z } = require('zod')

const requiredTrimmedString = (field) => z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? `${field} is required`
        : `${field} must be a string`
  })
  .trim()
  .min(1, `${field} is required`)

const integerFromString = (field, { min = 1, max } = {}) => {
  let schema = requiredTrimmedString(field)
    .regex(/^\d+$/, `${field} must be an integer`)
    .transform(Number)
    .refine((value) => value >= min, `${field} must be at least ${min}`)

  if (max !== undefined) {
    schema = schema.refine((value) => value <= max, `${field} must be at most ${max}`)
  }

  return schema
}

const decimalFromString = (field) => requiredTrimmedString(field)
  .regex(/^\d+(\.\d+)?$/, `${field} must be a valid number`)
  .transform(Number)
  .refine((value) => Number.isFinite(value), `${field} must be a valid number`)
  .refine((value) => value > 0, `${field} must be greater than 0`)

const ISO_8601_UTC_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/

const dateTimeFromString = (field) => requiredTrimmedString(field)
  .regex(
    ISO_8601_UTC_REGEX,
    `${field} must be a valid ISO 8601 UTC datetime (e.g. 2026-03-12T10:00:00.000Z)`
  )
  .refine((value) => !Number.isNaN(Date.parse(value)), `${field} must be a valid datetime`)
  .transform((value) => new Date(value))

const paginationSchema = z.object({
  page: integerFromString('page'),
  size: integerFromString('size', { max: 100 })
}).strict()

const idParamSchema = z.object({
  id: requiredTrimmedString('id')
    .refine((value) => {
      const normalized = value.toLowerCase()
      return normalized !== 'undefined' && normalized !== 'null' && normalized !== ':id'
    }, 'id is required')
}).strict()

module.exports = {
  z,
  requiredTrimmedString,
  integerFromString,
  decimalFromString,
  dateTimeFromString,
  paginationSchema,
  idParamSchema
}
