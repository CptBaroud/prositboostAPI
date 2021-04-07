const conf = require('../models/conf')

const confController = {
    get(req, res) {
        conf
            .findOne()
            .exec(function (err, doc) {
                if (!doc) {
                    const new_conf = new conf({
                        numProsit: 1
                    })
                    new_conf.save(function (err, doc) {
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
                } else if (!err && doc) {
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

    updateProsit(req, res) {
        conf
            .findOneAndUpdate({},
                {$set: {numProsit: req.body.numProsit}},
                {useFindAndModify: false, new: true})
            .exec(function (err, doc) {
                if (!err) {
                    if (process.env.DEV) {
                        req.app.httpIo.emit('numProsit', {action: 'fetch', numProsit: req.body.numProsit})
                    }
                    req.app.httpsIo.emit('numProsit', {action: 'fetch', numProsit: req.body.numProsit})
                    res.status(200).send(doc)
                } else {
                    res.status(500).json({
                        message: 'Internal Server Error',
                        error: err,
                        stack: err.stack
                    })
                }
            })
    }
}

module.exports = confController
