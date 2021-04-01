const jwt = require('jsonwebtoken')

/**
 * Middleware verifiant la validité d'un token
 * @param req la requete envoyée
 * @param res la reponse à envoyé
 * @param next la fonction suivante
 * @returns {this} soit un 404 ou laisse l'API continué
 */
function isAuthenticated(req, res, next) {
    // On recupere le token dans les headers
    // Le token n'est pas précéder de Bearer dans mon cas
    // On n'a donc pas a split le token recupérer
    const token = req.headers.authorization
    // Si le token est null on renvoit une erreur 404
    if (!token) return res.status(404).json({
        message: 'Missing Token',
        error: 'Token not found or null'
    })

    // On verifie la validité du token
    jwt.verify(token, process.env.JWT_SECRET_SIGN, (err, payload) => {
        // Si la verification échoue on renvoie un 404
        // Et on print dans la console le message d'erreur
        if (err) {
            return res.status(404).send({
                message: 'Invalid Token',
                error: err,
                stack: err.stack
            })
        }
        // Si on ne rencontre aucune erreur on passe à la fonction suivante
        next()
    })
}

module.exports = { isAuthenticated }
