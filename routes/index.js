const express = require("express");
const router = express.Router();

const movieRoutes = require("./movie.routes");

router.use("/movies", movieRoutes);

module.exports = router;