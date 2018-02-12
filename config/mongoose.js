/**
 * Mongoose configuration.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

'use strict'

let mongoose = require('mongoose')
mongoose.Promise = global.Promise
const options = {
  useMongoClient: true
}
// If using vagrant
const CONNECTION_STRING = 'mongodb://localhost/purenumbers'
// If using mlab
// const CONNECTION_STRING = 'your connectionstring here'

module.exports = function () {
  let db = mongoose.connection

  db.on('connected', function () {
    console.log('Mongoose connection open.')
  })

  db.on('error', function (err) {
    console.error('Mongoose connection error: ', err)
  })

  db.on('disconnected', function () {
    console.log('Mongoose connection disconnected.')
  })

    // If the Node process ends, close the Mongoose connection.
  process.on('SIGINT', function () {
    db.close(function () {
      console.log('Mongoose connection disconnected through app termination.')
      process.exit(0)
    })
  })
  mongoose.connect(CONNECTION_STRING, options)
  return db
}
