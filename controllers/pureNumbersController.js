/**
 * PureNumbers controller.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

'use strict'

const moment = require('moment')
const PureNumber = require('../models/PureNumber')

const pureNumbersController = {}

/**
 * Displays a list of pure numbers.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
pureNumbersController.index = async (req, res, next) => {
  try {
    const viewData = {
      pureNumbers: (await PureNumber.find({}))
        .map(pureNumber => ({
          id: pureNumber._id,
          createdAt: moment(pureNumber.createdAt).fromNow(),
          value: pureNumber.value
        }))
        .sort((a, b) => a.value - b.value)
    }
    res.render('pureNumbers/index', { viewData })
  } catch (error) {
    next(error)
  }
}

/**
 * Returns a HTML form for creating a new pure number.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
pureNumbersController.new = async (req, res) => {
  const viewData = {
    value: undefined
  }
  res.render('pureNumbers/new', { viewData })
}

/**
 * Creates a new pure number.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
pureNumbersController.create = async (req, res) => {
  try {
    // Create a new pure number...
    const pureNumber = new PureNumber({
      value: req.body.value
    })

    // ...save the number to the database...
    await pureNumber.save()

    // ...and redirect and show a message.
    req.session.flash = { type: 'success', text: 'The pure number was saved successfully.' }
    res.redirect('.')
  } catch (error) {
    // If an error, or validation error, occurred, view the form and an error message.
    return res.render('pureNumbers/new', {
      validationErrors: [error.message] || [error.errors.value.message],
      value: req.body.value
    })
  }
}

// Exports.
module.exports = pureNumbersController
