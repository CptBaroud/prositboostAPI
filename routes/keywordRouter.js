const keywordController = require('../controller/keywordController')
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    keywordController.get(req, res)
})

router.get('/definitions', (req, res) => {
    keywordController.getDef(req, res)
})

router.put('/', (req, res) => {
    keywordController.chooseDef(req, res)
})

module.exports = router
