const mongo = require('mongoose')
    , Schema = mongo.Schema

const notifications_schema = new Schema({
    info: Object,
    created: { type: Date, default: Date.now() },
    author: { type: mongo.ObjectId, ref: 'users' },
    receiver: { type: mongo.ObjectId, ref: 'users' },
    seen: Boolean,
    read: Boolean,
    title: String,
    to: String
})

const notifications = mongo.model('notification', notifications_schema)

module.exports = notifications
