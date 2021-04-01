const teamModel = require('../models/team')
const userModel = require('../models/users')

let teamController = {

    get(req, res) {
        teamModel
            .find()
            .populate('scribe secretaire animateur gestionaire')
            .exec(function (err, doc) {
                if (!err) {
                    res.status(200).send(doc)
                } else {
                    res.status(500).json({
                        message: 'Internal Server Error',
                        error: err,
                        stack: err.stack
                    })
                }
            })
    },

    getCurrentTeam (req, res) {
        const num = req.query.num % 9
        console.log(num)
        teamModel
            .findOne({num: num})
            .populate('scribe secretaire animateur gestionaire')
            .exec(function (err, doc) {
                if (!err) {
                    res.status(200).send(doc)
                } else {
                    res.status(500).json({
                        message: 'Internal Server Error',
                        error: err,
                        stack: err.stack
                    })
                }
            })
    },

    make (req, res) {
      const new_team = new teamModel({
          num: req.body.num,
          scribe: req.body.scribe,
          secretaire: req.body.secretaire,
          animateur: req.body.animateur,
          gestionaire: req.body.gestionaire
      })

        new_team
            .save(function (err){
            if (!err) {
                teamModel
                    .populate(new_team,
                        {path: 'secretaire scribe animateur gestionaire'},
                        function (err, doc){
                            if (!err) {
                                res.status(200).send(doc)
                            } else {
                                res.status(500).json({
                                    message: 'Internal Server Error',
                                    error: err,
                                    stack: err.stack
                                })
                            }
                        })
            } else {
                res.status(500).json({
                    message: 'Internal Server Error',
                    error: err,
                    stack: err.stack
                })
            }
        })
    },

    /**
     * Créer les equipes
     * On doit assigner au
     * @param req
     * @param res
     */
    async create(req, res) {
        // On load tout les users de la table
        const users = await userModel.find().exec()

        //Il doit y avoir autant d'equipes qu'il y'a d'utilisateurs
        //Pour que chacun puisse avoir au moins une fois chaque roles
        const teams = []

        for (let a = 1; a <= users.length; a++) {
            // On initialise l'objet
            let team = { animateur: '', gestionaire: ''}
            // Utilisateur
            let user

            let mark = 0

            // Tant que l'equipe n'est pas complète
            // Cad que les 4 postes soient pourvu
            // Donc que le nombre de clées de l'objet
            // Soit de 4
        }
        res.status(400).send({
            message: 'Deprecated not used anymore'
        })
    }
}

module.exports = teamController
