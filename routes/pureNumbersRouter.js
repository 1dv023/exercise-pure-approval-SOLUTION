/**
 * PureNumber routes.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

'use strict'

const router = require('express').Router()

const controller = require('../controllers/pureNumbersController')

// Lists all pure numbers.
router.get('/', controller.index)

// Creates a new pure number.
router.get('/new', controller.new)
router.post('/create', controller.create)

// Exports.
module.exports = router
