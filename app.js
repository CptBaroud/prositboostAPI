const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const mongo = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize');

// Initialisaiton du fichier .env
require('dotenv').config()

// Declaration des routes HTTP/S de l'api
const usersRouter = require('./routes/userRouter');
const teamRouter = require('./routes/teamRouter');
const loginRouter = require('./routes/authRouter');
const prositRouter = require('./routes/prositRouter');
const keywordRouter = require('./routes/keywordRouter');
const kivaferkoiRouter = require('./routes/kivaferkoiRouter');
const confRouter = require('./routes/confRouter');

// Initiliastion de la connection à la base mongodb
mongo.connect(process.env.MONGODB_LINK, {useNewUrlParser: true, useUnifiedTopology: true})
let db = mongo.connection;

// On essaye de se connecter à la base
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function () {
    console.log("Connexion à la base OK");
});

const app = express();

app.use(logger('dev'));
app.use(cors())

// Limite la taille des fichiers
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
app.use(cookieParser());

// Rend disponible les dossier upload et public
app.use(express.static(path.join(__dirname, 'upload')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Permet de prevenir les injections No-SQL
app.use(mongoSanitize());

// Définitions des routes pour l'API
app.use('/prosit', prositRouter);
app.use('/users', usersRouter);
app.use('/team', teamRouter);
app.use('/login', loginRouter);
app.use('/kivaferkoi', kivaferkoiRouter);
app.use('/keywords', keywordRouter);
app.use('/conf', confRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

module.exports = app;
