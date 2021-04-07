const jwt = require('../utils/jwt.utils')
const users = require('../models/users')
const bcrypt = require("bcrypt");

let authController = {
    tempToken(req, res) {
        res.send(jwt.generateOneTimeToken())
    },

    /**
     * Methode de login
     * @param req
     * @param res
     */
    login(req, res) {
        users
            .findOne({mail: req.body.mail.toLowerCase()})
            .exec(function (err, user) {
                if (err) {
                    res.status(500).json({
                        message: "Une erreur serveur est survenue",
                        error: err,
                        stack: err.stack
                    })
                } else if (!user && err) {
                    res.status(202).json({
                        message: "Cette adresse mail n'est associée à aucun compte",
                        error: err,
                        stack: err.stack
                    })
                } else if (user) {
                    bcrypt
                        .compare(req.body.password, user.password, function (error, result) {
                        if (error) {
                            res.status(500).json({
                                message: 'Une erreur est survenue',
                                error: error,
                                stack: error.stack
                            })
                        } else {
                            if (result) {
                                res.status(200).json({
                                    token: jwt.generatedToken(req.body)
                                })
                            } else {
                                res.status(401).json({
                                    message: 'Le mot de passe est incorrect'
                                })
                            }
                        }
                    })
                } else {
                    res.status(401).json({
                        message: 'L\'user n\'existe pas'
                    })
                }
            })
    }
}

module.exports = authController
