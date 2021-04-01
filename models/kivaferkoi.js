const mongo = require('mongoose')
    , Schema = mongo.Schema

const kivaferkoi_schema = new Schema({
    notYetPicked:[
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    picked:[
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    alreadyPicked:[
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ]
})

const kivaferkoi = mongo.model('kivaferkoi', kivaferkoi_schema)

module.exports = kivaferkoi
