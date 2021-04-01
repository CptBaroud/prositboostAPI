const mail = require('./mailController')
const users = require('../models/users')
let jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

let userController = {
    get(req, res) {
        users
            .find()
            .exec(function (err, doc) {
                if (!err) {
                    res.status(200).send(doc)
                } else {
                    res.status(500).send({
                        message: 'Internale Server Error',
                        error: err,
                        stack: err.stack
                    })
                }
            })
    },

    /**
     * Créer un utilisateur
     * @param req
     * @param res
     */
    add(req, res) {
        const password = Math.random().toString(36).slice(-8);
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                res.status(500).json({
                    message: 'Une erreur est survenue lors du cryptage du mot de passe, salt',
                    error: err
                })
            } else {
                bcrypt.hash(password, salt, function (err, pswd) {
                    if (err) {
                        res.status(500).json({
                            message: 'Une erreur est survenue lors du cryptage du mot de passe, hash',
                            error: err
                        })
                    } else {
                        let new_user = new users({
                            name: req.body.name,
                            surname: req.body.surname,
                            mail: req.body.mail,
                            password: pswd,
                            role: req.body.isAdmin ? 2 : 1
                        })

                        new_user
                            .save(function (err, doc) {
                                if (!err) {
                                    /* mail.sendRegisterMail({
                                       name: req.body.name,
                                       mail: req.body.mail,
                                       password: password
                                    }) */
                                    res.status(200).json(doc)
                                } else {
                                    res.status(500).json({
                                        message: 'Internale Server Error',
                                        error: err,
                                        stack: err.stack
                                    })
                                }
                            })
                    }
                })
            }
        })
    },

    createAccount (req, res) {
        const password = Math.random().toString(36).slice(-8);
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                res.status(500).json({
                    message: 'Une erreur est survenue lors du cryptage du mot de passe, salt',
                    error: err
                })
            } else {
                bcrypt.hash(password, salt, function (err, pswd) {
                    if (err) {
                        res.status(500).json({
                            message: 'Une erreur est survenue lors du cryptage du mot de passe, hash',
                            error: err
                        })
                    } else {
                        users
                            .findOneAndUpdate({_id: req.body.user},
                                {$set: {password: pswd}, },
                                {useFindAndModify: false, new: true},
                                function (err, doc) {
                                if (!err) {
                                    console.log(password)
                                    mail.sendRegisterMail({
                                       name: doc.name,
                                       mail: doc.mail,
                                       password: password
                                    })
                                    res.status(200).json(doc)
                                } else {
                                    res.status(500).json({
                                        message: 'Internale Server Error',
                                        error: err,
                                        stack: err.stack
                                    })
                                }
                            })
                    }
                })
            }
        })
    },

    /**
     * Pour l'authentification de Nuxt <br>
     * /!\ Attention ne correspond a nos norme mais c'est requis pour nuxt ne pas toucher
     * @param req  la requete envoyée
     * @param res  la reponse que retourne l'API
     *
     * Renvoie les infos de l'utilisateur
     */
    getUser(req, res) {
        let data = jwt.decode(req.headers.authorization)
        users.findOne({mail: data.mail}, function (err, user) {
            if (err) {
                res.status(500).json({
                    message: 'Internal Server Error',
                    error: err,
                    stack: err.stack
                })
            } else {
                res.status(200).json({user: user})
            }
        })
    },
}

module.exports = userController
