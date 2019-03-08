/**
 * Mongoose model PureNumber.
 *
 * @author Mats Loock
 * @version 1.2.0
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create a schema, with customized error messages.
const pureNumberSchema = new Schema({
  value: {
    type: Number,
    required: '`{PATH}` is required!',
    max: [42, '`{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
    min: [1, '`{PATH}` ({VALUE}) is beneath the limit ({MIN}).']
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
const PureNumber = mongoose.model('PureNumber', pureNumberSchema)

// Export the model.
module.exports = PureNumber
