/**
 * The starting point of the application.
 *
 * @author Mats Loock
 * @version 1.1.0
 */

'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const exphbs = require('express-handlebars')
const favicon = require('serve-favicon')
const path = require('path')
const session = require('express-session')

const mongoose = require('./config/mongoose.js')
const PureNumberRouter = require('./routes/PureNumberRouter')

const app = express()
const port = process.env.PORT || 8000

// Connect to the database.
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// Configure rendering engine, with change extension to .hbs.
app.engine('hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main'
}))

// Setup view engine.
app.set('view engine', 'hbs')

// Serve static files.
app.use(express.static(path.join(__dirname, 'public')))

// Serve a favicon from the given path.
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')))

// Parse application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: true }))

// Setup session store with the given options.
const sessionOptions = {
  name: 'name of keyboard cat', // Don't use default session cookie name.
  secret: 'keyboard cat', // Change it!!! The secret is used to hash the session with HMAC.
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

app.use(session(sessionOptions))

// Flash messages - survives only a round trip.
app.use((req, res, next) => {
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})

// Define routes.
app.use('/', PureNumberRouter.routes)
app.use((req, res, next) => { // catch 404 (ALWAYS keep this as the last route)
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

// Error handler.
app.use((err, req, res, next) => {
  // 404 Not Found.
  if (err.status === 404) {
    return res.status(404).sendFile(path.join(__dirname, 'views', 'error', '404.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res.status(500).sendFile(path.join(__dirname, 'views', 'error', '500.html'))
  }

  // Development only!
  // Set locals, only providing error in development.
  res.locals.error = err

  // Render the error page.
  res.status(err.status || 500).render('error/error')
})

// Start listening.
app.listen(port, () => {
  console.log(`\nServer started on http://localhost:${port}`)
  console.log('Press Ctrl-C to terminate...\n')
})
