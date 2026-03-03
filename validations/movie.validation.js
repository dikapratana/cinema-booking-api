const { default: z } = require("zod");

const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

const createMovieSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  duration: z.number({
    required_error: "duration is required",
    invalid_type_error: "duration must be a number",
  }),
  posterUrl: z
    .string()
    .regex(URL_REGEX, "posterUrl must be valid URL")
    .optional(),
});

const getAllMoviesQuerySchema = z.object({
  page: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "page is required"
          : "page must be a string",
    })
    .regex(/^\d+$/, "page must be an integer")
    .transform(Number)
    .refine((value) => value >= 1, "page must be at least 1"),
  size: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "size is required"
          : "size must be a string",
    })
    .regex(/^\d+$/, "size must be an integer")
    .transform(Number)
    .refine((value) => value >= 1, "size must be at least 1")
    .refine((value) => value <= 100, "size must be at most 100"),
});

module.exports = {
  createMovieSchema,
  getAllMoviesQuerySchema,
};
