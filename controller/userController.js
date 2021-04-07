const mail = require('./mailController')
const users = require('../models/users')
let jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const fs = require("fs");

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

    /**
     * Créer un mot de passe pour le compte
     * @param req
     * @param res
     */
    createAccount(req, res) {
        const password = Math.random().toString(36).slice(-8);
        bcrypt
            .genSalt(10, function (err, salt) {
            if (err) {
                res.status(500).json({
                    message: 'Une erreur est survenue lors du cryptage du mot de passe, salt',
                    error: err
                })
            } else {
                bcrypt
                    .hash(password, salt, function (err, pswd) {
                    if (err) {
                        res.status(500).json({
                            message: 'Une erreur est survenue lors du cryptage du mot de passe, hash',
                            error: err
                        })
                    } else {
                        users
                            .findOneAndUpdate({_id: req.body.user},
                                {$set: {password: pswd},},
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


    /**
     * Edit les données d'un agent
     * @param req
     * @param res
     */
    editUser(req, res) {
        const _id = req.body._id
        delete req.body._id

        users
            .findByIdAndUpdate(
                {_id: _id},
                {$set: req.body},
                {useFindAndModify: false, new: true}
            )
            .exec(function (err, doc) {
                if (!err) {
                    res.status(200).send(doc)
                } else {
                    res.status(500).send(err)
                }
            })
    },

    /**
     * Update la photo de profil
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async profilePicture(req, res) {
        // Initialisation des variables
        const data = req.body
        const _id = data._id
        let base64Data
        let ext

        // On set l'extenion sur fichier à enregistrer
        ext = '.' + data.name.split('.').pop()

        // Et on retire la balise data - base64 du fichier
        // Pour pouvoir l'entregistrer
        base64Data = data.file.replace(/^data:([A-Za-z-+\/]+);base64,/, "")

        // On set le nom du fichier tel qu'il
        // Sera enregistrer sur le serveur
        const filename = 'profilepic' + ext
        // On set le chemin d'enregistrement
        // Dans le dosssier upload et dans
        // un dossier nommer en fct de l'_id du ticket
        const path = 'upload/' + data._id + '/' + filename

        // On essaye de créer le dossier au nom de l'_id de l'utilisateur
        await fs.mkdir('./upload/' + data._id, function (err) {
            // Si on ne rencontre pas d'erreur
            // Ou que le dossier existe déjà
            if (!err || err.code === 'EEXIST') {
                // On enregistre le fichier sur le serveur
                fs.writeFile(path, base64Data, 'base64', function (err) {
                    if (err) {
                        console.log(err)
                        res.status(500).json({
                            message: "Internal Server Error",
                            error: err,
                            stack: err.stack
                        })
                    } else {
                        console.log('Fichier écris avec succès')
                    }
                });
            } else {
                console.log(err)
                res.status(500).json({
                    message: "Internal Server Error",
                    error: err,
                    stack: err.stack
                })
            }
        })


        // On renseigne le chemin d'accès du fichier
        // Afin de le rendre accessible depuis le frontEnd
        // ex : https://localhost:3000/_id/filename.ext
        const file = process.env.API_LINK + data._id + '/' + filename

        // On push dans ticket le nouvel attachement
        users
            .findByIdAndUpdate(
                {_id: _id},
                {$set: {avatar: file}},
                {useFindAndModify: false, new: true})
            .exec(function (err, doc) {
                if (!err) {
                    res.status(200).send(doc)
                } else {
                    res.status(500).json({
                        message: 'Internal Server Error',
                        error: err,
                        stack: err.stack
                    })
                }
            })
    },

    /**
     * Permet de verifier le mot de passe
     * @param req
     * @param res
     */
    checkPassword(req, res) {
        users
            .findOne({_id: req.body._id})
            .exec(function (err, doc) {
                if (!err && doc) {
                    bcrypt.compare(req.body.password, doc.password, function (err, out) {
                        if (!err && out) {
                            res.status(200).json({
                                isPasswordCorrect: true
                            })
                        } else {
                            res.status(500).json({
                                isPasswordCorrect: false
                            })
                        }
                    })
                } else {
                    res.status(500).json({
                        message: 'Une erreur est survenue',
                        error: err,
                        stack: err.stack
                    })
                }
            })
    },

    /**
     * Change le mot de passe
     * @param req
     * @param res
     */
    changePassword(req, res) {
        bcrypt
            .genSalt(10, function (err, salt) {
            if (err) {
                res.status(500).json({
                    message: 'Une erreur est survenue lors du cryptage du mot de passe, salt',
                    error: err
                })
            } else {
                bcrypt
                    .hash(req.body.password, salt, function (err, pswd) {
                    if (err) {
                        res.status(500).json({
                            message: 'Une erreur est survenue lors du cryptage du mot de passe, hash',
                            error: err
                        })
                    } else {
                        users
                            .findOneAndUpdate({_id: req.body.user},
                                {$set: {password: pswd},},
                                {useFindAndModify: false, new: true},
                                function (err, doc) {
                                    if (!err) {
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
    }
}

module.exports = userController
