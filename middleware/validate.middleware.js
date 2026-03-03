const { errorResponse } = require("../utils/response");

const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const issues = result.error.issues || [];

    const errors = issues.map((issue) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    return errorResponse(res, "Validation error", errors, 422);
  }

  req.validatedData = result.data;
  next();
};

module.exports = validate;
