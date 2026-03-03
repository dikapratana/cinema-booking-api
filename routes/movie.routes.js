const express = require("express");
const router = express.Router();

const movieController = require("../controllers/movie.controller");
const movieValidation = require("../validations/movie.validation");
const validationMiddleware = require("../middleware/validate.middleware");

router.post(
  "/",
  validationMiddleware(movieValidation.createMovieSchema),
  movieController.create
);

router.get(
  "/",
  validationMiddleware(movieValidation.getAllMoviesQuerySchema, "query"),
  movieController.findAll
);

module.exports = router;
