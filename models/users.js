const mongo = require('mongoose')
    , Schema = mongo.Schema

const users_schema = new Schema({
    name: String,
    surname: String,
    password: String,
    mail: String,
    role: Number,
    avatar: String,
    theme: Boolean
})

const users = mongo.model('users', users_schema)

module.exports = users
