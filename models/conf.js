const mongo = require('mongoose')
    , Schema = mongo.Schema

const conf_schema = new Schema({
    numProsit: Number
})

const conf = mongo.model('conf', conf_schema)

module.exports = conf
