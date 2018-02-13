/**
 * PureNumber routes.
 *
 * @author Mats Loock
 * @version 1.1.0
 */

'use strict'

const router = require('express').Router()
const PureNumber = require('../models/PureNumber')

/**
 * Finds all pure numbers in the database and renders them.
 */
router.route('/')
  .get(async (req, res) => {
    try {
      const pureNumbers = await PureNumber.find({}).exec()
      res.render('pureNumber/index', { pureNumbers })
    } catch (error) {
      res.render('pureNumber/index', {
        // DIRTY(?): Use the flash partial to view the error message.
        flash: { type: 'danger', text: error.message },
        pureNumbers: []
      })
    }
  })

/**
 * Crates and saves a pure number in the database.
 */
router.route('/create')
  .get((req, res) => {
    res.render('pureNumber/create', { value: undefined })
  })
  .post(async (req, res, next) => {
    try {
      // Create a new pure number...
      let pureNumber = new PureNumber({
        value: req.body.value
      })

      // ...save the number to the database...
      await pureNumber.save()

      // ...and redirect and show a message...
      req.session.flash = { type: 'success', text: 'The pure number saved successfully.' }
      res.redirect('.')
    } catch (error) {
      // ...or, if an error, or validation error, occurred, view the form and an error message.
      return res.render('pureNumber/create', {
        validationErrors: [error.message] || [error.errors.value.message],
        value: req.body.value
      })
    }
  })

// Exports.
module.exports = router
