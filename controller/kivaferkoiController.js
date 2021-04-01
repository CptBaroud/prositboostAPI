const kivaferkoi = require('../models/kivaferkoi')
const users = require('../models/users')

let kivaferkoiController = {

    get(req, res) {
        kivaferkoi
            .findOne()
            .populate('notYetPicked picked alreadyPicked')
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


    /**
     * Permet de tirer au sort les personnes pour le kivaferkoi
     * // TODO : les notifications
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async shuffle(req, res) {
        // On récupère les tableaux
        let teams = await kivaferkoi.findOne().populate('notYetPicked picked alreadyPicked').exec()
        // On récupère tout les utilisateurs inscrit
        const user = await users.find().exec()
        // Nombre de personne a tiré au sort
        let size = req.body.size
        // Id du kivaferkoi
        let _id = req.body._id

        const temp = []
        // Si c'est la première fois qu'on fait la commande on initialise le systeme
        if (!teams) {
            // On initialise l'objet
            const new_kivaferkoi = new kivaferkoi({
                notYetPicked: user
            })

            // On enregistre l'objet
            teams = await new_kivaferkoi.save()

            // On récupère l_id de notre objet
            _id = teams._id
        } else {
            _id = teams._id
        }

        if (size && size <= user.length ) {
            // Si le nombre de personne est disponible
            if (size <= teams.notYetPicked.length) {
                // On tire normalement les personnes
                pick(teams, size, temp)

                // Si le nombre de personne n'est pas disponible
                // mais qu'il reste des gens a tirer dans NotyetPicked
            }
            else if (teams.notYetPicked.length > 0) {
                // Pour chaque personne restant dans le tableau de gens pas encore tiré au sort
                // On les ajoute au tirage et on les sorts de ceux a tiré
                teams.notYetPicked.forEach(function (item) {
                    temp.push(item)
                    teams.alreadyPicked.push(item)
                })

                // On update le nombre de personne restant a query
                size = size - temp.length

                // On re-rempli le tableaux de gens à tirer
                // et on vide celui de ceux déja tiré au sort
                teams.notYetPicked = teams.alreadyPicked
                teams.alreadyPicked = []

                // Si il reste des gens a tiré au sort
                if (size > 0) {
                    // On ajoutes les personne precedement tiré a ceux deja tiré
                    // et on les retire du tirage a venir
                    temp.forEach(function (item) {
                        teams.notYetPicked.splice(teams.notYetPicked.indexOf(item), 1)
                        teams.alreadyPicked.push(item)
                    })
                    // On tire au sort le nombre de personnes restantes
                    pick(teams, size, temp)
                }
            }
            else {
                // Lorsque le tableau de personnes a tiré est vide
                // On reset le systeme et on fait le tirage normalement
                teams.notYetPicked = teams.alreadyPicked
                teams.alreadyPicked = []
                pick(teams, size, temp)
            }

            // On push les gens tiré au sort dans le tableau des personnes tirées au sort
            teams.picked = temp

            // On save les changement dans la base de données
            // Et on renvois le resultat
            kivaferkoi
                .findByIdAndUpdate({_id: _id},
                    {
                        $set: {
                            notYetPicked: teams.notYetPicked,
                            picked: teams.picked,
                            alreadyPicked: teams.alreadyPicked
                        }
                    },
                    {useFindAndModify: false, new: true})
                .populate('notYetPicked picked alreadyPicked')
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
        } else {
            res.status('500').json({
                message: 'Le nombre de personnes demandé est superieur aux nombre d\'inscrits'
            })
        }
    },

    update (req, res) {
        console.log('update')
        console.log(req.body)
    }
}

module.exports = kivaferkoiController


/**
 * Fonction permettant de recupérer un nombre random
 * entre 0 et la taille de notyetPicked
 * @returns {null|number}
 */
function getRandomInt(size) {
    if (size > 0) {
        return Math.floor(Math.random() * size)
    }
    return null
}

/**
 * Permet de tirer au sort un users
 * @param teams
 * @param size
 * @param array
 */
function pick(teams, size, array) {
    for (let a = 0; a < size; a++) {
        const random = getRandomInt(size)
        if (random != null) {
            const user = teams.notYetPicked[random]
            teams.notYetPicked.splice(teams.notYetPicked.indexOf(user), 1)
            teams.alreadyPicked.push(user)
            array.push(user)
        } else {
            teams.notYetPicked = teams.alreadyPicked
            teams.alreadyPicked = []
        }
    }
}
