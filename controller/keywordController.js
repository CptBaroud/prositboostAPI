const keyword = require('../models/keyword')
const axios = require('axios')

const keywordController = {
    get(req, res) {
        keyword
            .find()
            .exec(function (err, doc) {
                if (!err) {
                    res.send(doc)
                } else {
                    res.status(500).json({
                        message: 'Internal Server Error',
                        error: err,
                        stack: err.stack
                    })
                }
            })
    },

    add(req, res) {
        const new_keyword = new keyword(req.body)

        new_keyword
            .save(function (saveErr, doc) {
                if (!saveErr) {
                   res.status(200).send(doc)
                } else {
                    res.status(500).send({
                        message: 'Internal Server Error',
                        err: saveErr,
                        stack: saveErr.stack
                    })
                }
            })
    },

    getDef(req, res) {
        const api_call = 'https://api.dicolink.com/v1/mot/' + req.body.keyword + '/definitions?limite=200&api_key=' + process.env.DICOLINK_API_KEY

        console.log(api_call)

        axios.get(api_call)
            .then((response) => {
                res.status(200).send(response.data)
            })
            .catch((e) => {
                console.log(e)
                res.status(500).json({
                    message: 'Internal Server Error',
                    error: e,
                    stack: e.stack
                })
            })
    },

    chooseDef(req, res) {
        keyword
            .findByIdAndUpdate({_id: req.body._id},
                {$set: {def: req.body.def}},
                {useFindAndModify: false, new: true},
                function (err, doc) {
                    if (!err) {
                        console.log(doc)
                        if (process.env.DEV) {
                            req.app.httpIo.emit('prosit', {action: 'fetch'})
                        }
                        req.app.httpsIo.emit('prosit', {action: 'fetch'})
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

module.exports = keywordController
