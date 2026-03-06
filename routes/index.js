const express = require('express')
const router = express.Router()

const movieRoutes = require('./movie.routes')
const authRoutes = require('./auth.routes')
const cinemaRoutes = require('./cinema.route')

router.use('/auth', authRoutes)
router.use('/movies', movieRoutes)
router.use('/cinemas', cinemaRoutes)

module.exports = router
