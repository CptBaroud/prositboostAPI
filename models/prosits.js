const mongo = require('mongoose')
    , Schema = mongo.Schema

const prosit_schema = new Schema({
    prositNumber: Number,
    title: String,
    created: {
        type: Date,
        default: new Date()
    },
    keywords: [{
        type: Schema.Types.ObjectId,
        ref: 'keyword'
    }],
    context: String,
    constraints: [String],
    generalization: String,
    problematics: [String],
    hypotesies: [String],
    summary: [String],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

const prosit = mongo.model('prosit', prosit_schema)

module.exports = prosit
