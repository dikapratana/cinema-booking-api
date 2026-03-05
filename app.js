const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
require('dotenv').config()

const routes = require('./routes')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use('/api', routes)
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app
