const mongo = require('mongoose')
    , Schema = mongo.Schema

const team_schema = new Schema({
    num: Number,
    scribe: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    secretaire: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    animateur: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    gestionaire: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

const team = mongo.model('team', team_schema)

module.exports = team
