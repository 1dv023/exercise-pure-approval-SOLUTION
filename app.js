/**
 * The starting point of the application.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

'use strict'

// -----------------------------------------------------------------
// NOTE! Never push the .env file to a repository. In this solution,
//       it is added to the repository just for clarity.
// -----------------------------------------------------------------

require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const hbs = require('express-hbs')
const session = require('express-session')
const logger = require('morgan')
const { join } = require('path')
const mongoose = require('./configs/mongoose.js')

const app = express()

// Connect to the database.
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

// Setup view engine.
app.engine('hbs', hbs.express4({
  defaultLayout: join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))

// Request logger
app.use(logger('dev'))

// Serve static files.
app.use(express.static(join(__dirname, 'public')))

// Parse application/x-www-form-urlencoded.
app.use(express.urlencoded({ extended: true }))

// Setup session store with the given options.
const sessionOptions = {
  name: 'name of keyboard cat', // Don't use default session cookie name.
  secret: 'keyboard cat', // Change it!!! The secret is used to hash the session with HMAC.
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax'
  }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

app.use(session(sessionOptions))

// Middleware to be executed before the routes.
app.use((req, res, next) => {
  // Flash messages - survives only a round trip.
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
})

// Define routes.
// catch 404 (ALWAYS keep this as the last route)
app.use('/', require('./routes/pureNumbersRouter'))
app.use('*', (req, res, next) => next(createError(404)))

// Error handler.
app.use((err, req, res, next) => {
  // 404 Not Found.
  if (err.statusCode === 404) {
    return res
      .status(404)
      .sendFile(join(__dirname, 'views', 'errors', '404.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(join(__dirname, 'views', 'errors', '500.html'))
  }

  // Development only!
  // Set locals, only providing error in development.

  // Render the error page.
  res
    .status(err.status || 500)
    .render('errors/error', { error: err })
})

// Start listening.
app.listen(8000, () => {
  console.log('Server started on http://localhost:8000')
  console.log('Press Ctrl-C to terminate...')
})
