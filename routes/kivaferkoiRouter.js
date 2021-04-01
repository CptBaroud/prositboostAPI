const kivaferkoiController = require('../controller/kivaferkoiController')
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    kivaferkoiController.get(req, res)
})

router.post('/shuffle', (req, res) => {
    kivaferkoiController.shuffle(req, res)
})

router.put('/', (req, res) => {
    kivaferkoiController.update(req, res)
})

module.exports = router
