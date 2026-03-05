const express = require('express')
const router = express.Router()

const movieRoutes = require('./movie.routes')
const authRoutes = require('./auth.routes')

router.use('/auth', authRoutes)
router.use('/movies', movieRoutes)

module.exports = router
