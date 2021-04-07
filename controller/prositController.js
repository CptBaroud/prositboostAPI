const prosit = require('../models/prosits')
const keyword = require('../models/keyword')
const axios = require('axios')

const prositController = {
    /**
     * Créer un prosit, et précharge les définitions liées au mots clés.
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async add(req, res) {
        const data = req.body.prosit

        // On ajoute tout les mots clés dans la collection
        async function addKeyword() {
            let keywordsArray = []
            // Pour chaques mots clés
            for (const k of data.keywords) {
                let def = []
                let element = {
                    name: k,
                    definitions: []
                }
                const api_call = 'https://api.dicolink.com/v1/mot/' + k + '/definitions?limite=200&api_key=' + process.env.DICOLINK_API_KEY

                // On fait un appel l'api dicolink pour récupérer les défintions
                // Mais on en récupère tres peux
                await axios.get(api_call)
                    .then((response) => {
                        if (Array.isArray(response.data)) {
                            response.data.forEach((d) => {
                                element.definitions.push(d.definition)
                            })
                        } else {
                            element.def = response.data.definition
                        }
                    })
                    .catch((e) => {
                        console.error(e.stack)
                    })

                // Permet de récupérer le nom des pages wikipédia liées au mot recherché
                const wikiWord = 'https://fr.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=' + k

                // On récupère la liste des ces pages
                await axios.get(wikiWord,
                    {
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8'
                        }
                    })
                    .then(async (response) => {
                        if (Array.isArray(response.data[1])) {
                            // Pour chacune des pages on va récuperer la page correspondante et en extraire uniquement le texte dans un objet json
                            // Dans lequel on va ensuite garder uniquement "l'extract" qui contient une courte description de l'article qu'on va utiliser comme definition
                            for (const item of response.data[1]) {
                                // On fait la requete et doit en attendre le résultat avant de faire quoique ce soit
                               await axios.get('https://fr.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&origin=*&titles=' + item,
                                    {
                                        headers: {
                                            'Content-Type': 'application/json; charset=UTF-8'
                                        }
                                    })
                                    .then((response) => {
                                        const key = Object.keys(response.data.query.pages)[0]
                                        element.definitions.push(response.data.query.pages[key].extract)
                                    })
                                    .catch(e => console.error(e))
                            }
                        }
                    }).catch((onerror) => {
                        console.error(onerror)
                    })
                keywordsArray.push(element)
            }
            // On les insere dans la collecton
            // Et on retourne la promise pour pouvoir
            // insérer les données dans la coll prosit
            return keyword
                .insertMany(keywordsArray)
        }

        //On attend que tout les mots clés ai été ajouté
        data.keywords = await addKeyword()
        const new_prosit = new prosit(data)

        // On save le prosit
        new_prosit.save((err, doc) => {
            if (!err) {
                if (process.env.DEV) {
                    req.app.httpIo.emit('prosit', {action: 'fetch'})
                }
                req.app.httpsIo.emit('prosit', {action: 'fetch'})
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

    // Récupère tout les prosits
    get(req, res) {
        prosit
            .find()
            .populate('keywords author')
            .exec(function (err, doc) {
                if (!err) {
                    res.send(doc)
                } else {
                    res.status(500).json({
                        message: 'Internal Server Error',
                        error: err,
                        stack: err.stack
                    })
                }
            })
    }
}

module.exports = prositController
