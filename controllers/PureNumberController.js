/**
 * Module for the pure number controller.
 *
 * @author Mats Loock
 * @version 1.1.0
 */

'use strict'

const PureNumber = require('../models/PureNumber')
const PureNumberRepository = require('../repositories/PureNumberRepository')

class PureNumberController {
  /**
   * Creates an instance of PureNumberController.
   *
   * @param {PureNumberRepository} [repository=new PureNumberRepository()]
   */
  constructor (repository = new PureNumberRepository()) {
    this._repository = repository
  }

  /**
   * Sends a response containing all pure numbers.
   *
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   */
  async index (req, res) {
    try {
      // No need to transform the model data to a view model, just take it straight away.
      const viewModel = { pureNumbers: await this._repository.getAll() }
      res.render('pureNumber/index', viewModel)
    } catch (error) {
      const viewModel = {
        // DIRTY(?): Use the flash partial to view the error message.
        flash: { type: 'danger', text: error.message },
        pureNumbers: []
      }
      res.render('pureNumber/index', viewModel)
    }
  }

  /**
   * Sends a response containing a form.
   *
   * @param {Object} req
   * @param {Object} res
   */
  create (req, res) {
    const viewModel = { value: undefined }
    res.render('pureNumber/create', viewModel)
  }

  /**
   * Creats a new pure number, stores it and redirects to
   * the index page of the pure numbers.
   *
   * @param {Object} req
   * @param {Object} res
   */
  async createPost (req, res) {
    try {
      // Create a new pure number...
      const pureNumber = new PureNumber({
        value: req.body.value
      })

      // ...make the pure number persistent and...
      await this._repository.add(pureNumber)

      // ...and redirect to the list of pure numbers (the root of this route) and show a message...
      req.session.flash = { type: 'success', text: 'The pure number saved successfully.' }
      res.redirect('.')
    } catch (error) {
      // ...or, if an error, or validation error, occurred, view the form and an error message.
      const viewModel = {
        validationErrors: [error.message] || [error.errors.value.message],
        value: req.body.value
      }
      return res.render('pureNumber/create', viewModel)
    }
  }
}

// Export.
module.exports = PureNumberController
