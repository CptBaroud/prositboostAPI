const express = require('express');
const cors = require('cors')
const router = express.Router();
const notificationController = require('../controller/notificationsController')
const { isAuthenticated } = require('../middleware/authenticated')

const corsOptions = {
    origin: [process.env.SITE_LINK, process.env.API_LINK],
    optionsSuccessStatus: 200
}

router.get('/user', [cors(corsOptions), isAuthenticated], function (req, res) {
    notificationController.getUserNotifications(req, res)
});

router.get('/', [cors(corsOptions), isAuthenticated], function (req, res) {
    notificationController.get(req, res)
});

router.put('/seen', [cors(corsOptions), isAuthenticated], function (req, res) {
    notificationController.seen(req, res)
});

router.put('/read', [cors(corsOptions), isAuthenticated], function (req, res) {
    notificationController.read(req, res)
});

router.post('/', [cors(corsOptions), isAuthenticated], function (req, res) {
    notificationController.create(req, res)
});

module.exports = router;
