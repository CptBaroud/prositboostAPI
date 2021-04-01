let jwt = require('jsonwebtoken');

const JWT_SECRET_SIGN = process.env.JWT_SECRET_SIGN;

module.exports = {
    generatedToken: function (data) {
        return jwt.sign({
            mail: data.mail,
            date: new Date()
        }, JWT_SECRET_SIGN)
    },

    generateOneTimeToken: function () {
        return jwt.sign({
            type: 0
        }, JWT_SECRET_SIGN)
    },

    getTokenInfo: function (token) {
        return jwt.decode(token)
    }
};
