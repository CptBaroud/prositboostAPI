const userController = require('../controller/userController')
const express = require('express')

const { isAuthenticated } = require('../middleware/authenticated')

const router = express.Router()

// GET
router.get('/getUser', (req, res) => {
    userController.getUser(req, res)
})

router.get('/', isAuthenticated, (req, res) => {
    userController.get(req, res)
})

// POST
router.post('/', isAuthenticated, (req, res) => {
    userController.add(req, res)
})

router.post('/createAccount', isAuthenticated, (req, res) => {
    userController.createAccount(req, res)
})

router.post('/changePassword', isAuthenticated, (req, res) => {
    userController.changePassword(req, res)
})

router.post('/profilePicture', isAuthenticated, (req, res) => {
    userController.profilePicture(req, res)
})

// PUT
router.put('/checkPassword', isAuthenticated, (req, res) => {
    userController.checkPassword(req, res)
})

router.put('/', isAuthenticated, (req, res) => {
    userController.editUser(req, res)
})

module.exports = router
