const express = require('express');
const prositController = require('../controller/prositController')
const { isAuthenticated } = require('../middleware/authenticated')

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
        prositController.get(req, res)
})

router.post('/', isAuthenticated, (req, res) => {
        prositController.add(req, res)
})

module.exports = router;
