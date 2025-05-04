const express = require('express')
const mongoose = require('mongoose')
const env = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const app = express()

mongoose.connect(env.MONGODB_URI)

app.use(express.json()) 
app.use('/api/blogs', blogRouter)
app.use(middleware.errorHandler)

module.exports = app