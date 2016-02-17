/**
 * Home routes.
 *
 * @author Mats Loock
 * @version 1.0.0
 */

"use strict";

let router     = require("express").Router();
let PureNumber = require("../models/PureNumber");

// /
router.route("/")
    .get(function(req, res) {
        PureNumber.find({}, function(error, pureNumbers) {
            if (error) {
                req.session.flash = {type: "danger", text: error.message};
                pureNumbers = [];
            }

            res.render("home/index", { pureNumbers: pureNumbers });
        });
    });

// /create
router.route("/create")
    .get(function(req, res) {
        res.render("home/create", {value: undefined});
    })
    .post(function(req, res, next) {
        // Create a new pure number...
        let pureNumber = new PureNumber({
            value: req.body.value
        });

        // ...save the number to the database...
        pureNumber.save()
            .then(function() {
                // ...and redirect and show a message...
                req.session.flash = {type: "success", text: "The pure number saved successfully."};
                res.redirect("/");
            })
            .catch(function(err) {
                // ...or, if an error occurred, view the form and an error message.
                console.error(err);
                if (err.errors.value.name === "ValidatorError") {
                    return res.render("home/create", {
                        // TODO: Validation error instead of flash error?
                        flash: {type: "danger", text: err.errors.value.message},
                        value: req.body.value
                    });
                } else if (err.errors.value.name === "CastError") {
                    // If cast error it's a bad request!
                    err.status = 400;
                }

                // Let the middle ware handle any errors but ValidatorErrors.
                next(err);
            });
    });

// Exports.
module.exports = router;
