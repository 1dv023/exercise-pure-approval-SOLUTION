/**
 * PureNumber routes.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()

const controller = require('../controllers/pureNumberController')

// Lists all pure numbers.
router.get('/', controller.index)

// Creates a new purse number.
router.route('/create')
  .get(controller.create)
  .post(controller.createPost)

// Exports.
module.exports = router
