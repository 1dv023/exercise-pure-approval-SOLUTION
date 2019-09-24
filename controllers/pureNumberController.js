/**
 * PureNumber controller.
 *
 * @author Mats Loock
 * @version 1.2.0
 */

'use strict'

const moment = require('moment')
const PureNumber = require('../models/PureNumber')

const pureNumberController = {}

/**
 * Lists all pure numbers.
 */
pureNumberController.index = async (req, res) => {
  const locals = {
    pureNumbers: (await PureNumber.find({}))
      .map(pureNumber => ({
        id: pureNumber._id,
        createdAt: moment(pureNumber.createdAt).fromNow(),
        value: pureNumber.value
      }))
      .sort((a, b) => a.value - b.value)
  }
  res.render('pureNumber/index', { locals })
}

/**
 * Renders a create form.
 */
pureNumberController.create = async (req, res) => {
  const locals = {
    value: undefined
  }
  res.render('pureNumber/create', { locals })
}

/**
 * Creates a new pure number.
 */
pureNumberController.createPost = async (req, res) => {
  try {
    // Create a new pure number...
    const pureNumber = new PureNumber({
      value: req.body.value
    })

    // ...save the number to the database...
    await pureNumber.save()

    // ...and redirect and show a message.
    req.session.flash = { type: 'success', text: 'The pure number saved successfully.' }
    res.redirect('.')
  } catch (error) {
    // If an error, or validation error, occurred, view the form and an error message.
    return res.render('pureNumber/create', {
      validationErrors: [error.message] || [error.errors.value.message],
      value: req.body.value
    })
  }
}

// Exports.
module.exports = pureNumberController

// /**
//  * Finds all pure numbers in the database and renders them.
//  */
// router.route('/')
//   .get(async (req, res) => {
//     try {
//       const pureNumbers = await PureNumber.find({}).exec()
//       res.render('pureNumber/index', { pureNumbers })
//     } catch (error) {
//       res.render('pureNumber/index', {
//         // DIRTY(?): Use the flash partial to view the error message.
//         flash: { type: 'danger', text: error.message },
//         pureNumbers: []
//       })
//     }
//   })

// /**
//  * Crates and saves a pure number in the database.
//  */
// router.route('/create')
//   .get((req, res) => {
//     res.render('pureNumber/create', { value: undefined })
//   })
//   .post(async (req, res, next) => {
//     try {
//       // Create a new pure number...
//       const pureNumber = new PureNumber({
//         value: req.body.value
//       })

//       // ...save the number to the database...
//       await pureNumber.save()

//       // ...and redirect and show a message...
//       req.session.flash = { type: 'success', text: 'The pure number saved successfully.' }
//       res.redirect('.')
//     } catch (error) {
//       // ...or, if an error, or validation error, occurred, view the form and an error message.
//       return res.render('pureNumber/create', {
//         validationErrors: [error.message] || [error.errors.value.message],
//         value: req.body.value
//       })
//     }
//   })

// // Exports.
// module.exports = router
