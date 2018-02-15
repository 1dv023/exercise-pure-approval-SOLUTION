/**
 * Module for the product repository.
 *
 * @author Mats Loock
 * @version 1.1.0
 */

'use strict'

const PureNumber = require('../models/PureNumber')

/**
 * Represents a pure number repository.
 *
 * @class PureNumberRepositry
 */
class PureNumberRepositry {
  /**
   * Adds a pure number to the persistent storage.
   *
   * @param {PureNumber} pureNumber
   * @returns {Promise<PureNumber>}
   */
  async add (pureNumber) {
    return pureNumber.save()
  }

  /**
   * Gets all pure numbers ordered ascending.
   *
   * @returns {Promise<PureNumber[]>}
   */
  async getAll () {
    // Build query (query builder chaining syntax)
    return PureNumber
      .find({})
      .sort('value')
      .exec()
  }
}

module.exports = PureNumberRepositry
