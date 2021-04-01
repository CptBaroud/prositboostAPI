const mongo = require('mongoose')
    , Schema = mongo.Schema

const keyword_schema = new Schema({
    name: String,
    definitions: Array,
    def: String
})

const keyword = mongo.model('keyword', keyword_schema)

module.exports = keyword
