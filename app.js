/**
 * The starting point of the application.
 *
 * @author Mats Loock
 * @version 1.2.0
 */

'use strict'

const createError = require('http-errors')
const express = require('express')
const hbs = require('express-hbs')
const session = require('express-session')
const { resolve } = require('path')
const mongoose = require('./config/mongoose.js')

const app = express()

// Connect to the database.
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

// Setup view engine.
app.engine('hbs', hbs.express4({
  defaultLayout: resolve('views', 'layouts', 'default'),
  partialsDir: resolve('views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', resolve('views'))

// Serve static files.
app.use(express.static(resolve('public')))

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
  res.locals.flash = req.session.flash
  delete req.session.flash

  next()
})

// Define routes.
// catch 404 (ALWAYS keep this as the last route)
app.use('/', require('./routes/pureNumberRouter'))
app.use('*', (req, res, next) => next(createError(404)))

// Error handler.
app.use((err, req, res, next) => {
  // 403 Forbidden.
  if (err.statusCode === 403) {
    return res.status(403).sendFile(resolve('views', 'error', '403.html'))
  }

  // 404 Not Found.
  if (err.statusCode === 404) {
    return res.status(404).sendFile(resolve('views', 'error', '404.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res.status(500).sendFile(resolve('views', 'error', '500.html'))
  }

  // Development only!
  // Set locals, only providing error in development.
  res.locals.error = err

  // Render the error page.
  res.status(err.status || 500).render('error/error')
})

// Start listening.
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
  console.log('Press Ctrl-C to terminate...')
})
