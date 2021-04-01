const teamController = require('../controller/teamController')
const express = require('express')

const { isAuthenticated } = require('../middleware/authenticated')


const router = express.Router()

router.get('/', isAuthenticated, (req, res) => {
    teamController.get(req, res)
})

router.get('/currentTeam', isAuthenticated, (req, res) => {
    teamController.getCurrentTeam(req, res)
})

router.post('/', isAuthenticated, (req, res) => {
    teamController.make(req, res)
})

module.exports = router
