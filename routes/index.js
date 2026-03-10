const express = require('express')
const router = express.Router()

const movieRoutes = require('./movie.routes')
const authRoutes = require('./auth.routes')
const cinemaRoutes = require('./cinema.route')
const studioRoutes = require('./studio.routes')

router.use('/auth', authRoutes)
router.use('/movies', movieRoutes)
router.use('/cinemas', cinemaRoutes)
router.use('/studios', studioRoutes)

module.exports = router
