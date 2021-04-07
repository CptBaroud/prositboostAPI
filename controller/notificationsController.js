const notification = require('../models/notification')

let pageController = {
    /**
     * Récupération des notifications dans la bdd
     * @param req
     * @param res
     */
    get(req, res) {
        console.log('lol')
        notification
            .find()
            .populate('author receiver')
            .exec(function (err, com) {
                if (!err) {
                    res.status(200).json(com)
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
     * Récupération des notifications dans la bdd
     * @param req
     * @param res
     */
    getUserNotifications(req, res) {
        console.log(req.query.user)
        notification
            .find({receiver: {$eq: req.query.user}})
            .populate('author receiver')
            .exec(function (err, com) {
                if (!err) {
                    res.status(200).json(com)
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
     * Création d'une notification
     * @param req
     * @param res
     */
    create(req, res) {
        const new_notification = new notification({
            info: {
                type: req.body.type,
                icon: req.body.icon
            },
            author: req.body.author,
            receiver: req.body.receiver,
            title: req.body.title,
            seen: false,
            read: false,
            to: req.body.to
        })

        new_notification
            .save(function (err) {
                if (!err) {
                    notification
                        .populate(new_notification, {path: 'author receiver'}, function (err, doc) {
                            if (!err) {
                                // On informe tout les clients qu'il y a eu un nv contact
                                req.app.httpsIo.emit('notification', {doc})
                                if (process.env.DEV) {
                                    req.app.httpIo.emit('notification', {doc})
                                }
                                res.status(200).send(doc)
                            } else {
                                res.status(500).json({
                                    message: 'Une erreur est survenue',
                                    error: err,
                                    stack: err.stack
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
     * Lorsque l'user "voit" la notification
     * @param req
     * @param res
     */
    seen(req, res) {
        notification
            .findByIdAndUpdate(
                {_id: req.body._id},
                {$set: {seen: true}},
                {new: true, useFindAndModify: false})
            .populate('author receiver')
            .exec(function (err, doc) {
                if (!err) {
                    res.status(200).send(doc)
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
     * Marque une notification comme lue
     * @param req
     * @param res
     */
    read(req, res) {
        notification
            .findByIdAndUpdate(
                {_id: req.body._id},
                {$set: {read: true}},
                {new: true, useFindAndModify: false})
            .populate('author receiver')
            .exec(function (err, doc) {
                if (!err) {
                    res.status(200).send(doc)
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
     * Delete une notification
     * @param req
     * @param res
     */
    delete(req, res) {
        notification
            .findByIdAndDelete({_id: req.body._id})
            .populate('author receiver')
            .exec(function (err, response) {
                if (!err) {
                    res.status(200).send(response)
                } else {
                    res.status(500).json({
                        message: 'Une erreur est survenue',
                        error: err,
                        stack: err.stack
                    })
                }
            })
    }
}

module.exports = pageController
