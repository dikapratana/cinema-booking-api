const movieService = require("../services/movie.service");
const { successResponse, errorResponse } = require("../utils/response");

exports.findAll = async (req, res) => {
  try {
    const { data, meta } = await movieService.getAllMovies(req.validatedData);
    return successResponse(res, { message: "Success get movies", data, meta });
  } catch (error) {
    return errorResponse(
      res,
      error?.message || "Internal server error",
      null,
      500
    );
  }
};

exports.create = async (req, res) => {
  try {
    const movie = await movieService.createMovie(req.validatedData);
    return successResponse(res, {
      message: "Success create movie",
      data: movie,
    });
  } catch (error) {
    return errorResponse(
      res,
      error?.message,
      null,
      500
    );
  }
};


