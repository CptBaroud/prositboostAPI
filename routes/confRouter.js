const confController = require('../controller/confController')
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    confController.get(req, res)
})

router.post('/prosit', (req, res) => {
    confController.updateProsit(req, res)
})

module.exports = router
