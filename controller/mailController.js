const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { google } = require('googleapis')

const redirect_url = 'https://developers.google.com/oauthplayground'

const oAuht2Client = new google.auth.OAuth2(
    process.env.EMAIL_CLIENT_ID,
    process.env.EMAIL_TOKEN,
    redirect_url
)
oAuht2Client.setCredentials({refresh_token: process.env.EMAIL_REFRESH_TOKEN})

let MailGenerator = new Mailgen({
    theme: "cerberus",
    product: {
        name: "EviTicket",
        link: process.env.SITE_LINK,
        copyright: 'Copyright © ' + new Date().getFullYear() + ' PrositBoost. Tout droits réservés',
    },
});


let mailController = {
     async sendRegisterMail (data) {
        let response = {
            body: {
                name: data.name,
                intro: ["Votre compte sur PrositBoost a été crée avec succès", "" ,"Voici votre mot de passe : " + data.password],
                signature: false,
                action: {
                    instructions: 'Acceder à votre compte',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'Connexion',
                        link: process.env.SITE_LINK + '/login'
                    }
                },
                //outro: "Nous vous conseillons vivement de changer ce mot de passe généré de manière automatique pour des raisons de sécurité"
            },
        };

        let mail = MailGenerator.generate(response);

        let message = {
            from: 'noreply.eviticket@gmail.com',
            to: data.mail,
            subject: "Votre compte PrositBoost",
            html: mail
        };

         let accessToken = ''

         try {
             accessToken = await oAuht2Client.getAccessToken()
         } catch (e) {
             console.error(e)
         }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.EMAIL_CLIENT_ID,
                clientSecret: process.env.EMAIL_TOKEN,
                refreshToken: process.env.EMAIL_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        transporter
            .sendMail(message)
            .then(() => {
                console.log('Le mail à été envoyé')
            })
            .catch((error) =>  {
                console.log('Nodemailer')
                console.error(error)
            });
    }
}


module.exports = mailController
