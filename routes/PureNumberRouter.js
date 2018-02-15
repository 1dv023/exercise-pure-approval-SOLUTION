/**
 * PureNumber routes.
 *
 * @author Mats Loock
 * @version 1.1.0
 */

'use strict'

const router = require('express').Router()
const PureNumberController = require('../controllers/PureNumberController')

/**
 * Represents a pure number route.
 */
class PureNumberRouter {
  /**
   * Gets the routes.
   *
   * @readonly
   * @static
   */
  static get routes () {
    // NOTE: Must use .bind(PureNumberRouter.controller) to set this to refer to the
    //       correct instance, and not undefiend, in the PureNumberController
    ///      class' methods index, create and createPost.

    // The root (/)
    PureNumberRouter.router.get('/', PureNumberRouter.controller.index.bind(PureNumberRouter.controller))

    // Create (/create)
    PureNumberRouter.router.route('/create')
      .get(PureNumberRouter.controller.create.bind(PureNumberRouter.controller))
      .post(PureNumberRouter.controller.createPost.bind(PureNumberRouter.controller))

    return PureNumberRouter.router
  }
}

// Default values for static properties.
PureNumberRouter.controller = new PureNumberController()
PureNumberRouter.router = router

// Exports.
module.exports = PureNumberRouter
