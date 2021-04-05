const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

let MailGenerator = new Mailgen({
    theme: "cerberus",
    product: {
        name: "EviTicket",
        link: process.env.SITE_LINK,
        copyright: 'Copyright © ' + new Date().getFullYear() + ' PrositBoost. Tout droits réservés',
    },
});

let mailController = {
    sendRegisterMail (data) {
        console.log(data)
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

        transporter
            .sendMail(message)
            .then(() => {
                console.log('c parti')
            })
            .catch((error) => console.error(error));
    },

    sendClosedTicket (data) {
        let response = {
            body: {
                name: data.name,
                intro: ["Votre ticket \""+data.object + "\" à été cloturé", ""],
                signature: false,
                action: {
                    instructions: 'Télécharger le rapport d\'intervention',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'PDF',
                        link: process.env.API_LINK + '/' + data._id
                    }
                },
            },
        };

        let mail = MailGenerator.generate(response);

        let message = {
            from: 'noreply.eviticket@gmail.com',
            to: data.mail,
            subject: "Votre compte eviticket",
            html: mail,
        };

        transporter
            .sendMail(message)
            .then(() => {
                console.log('c parti')
            })
            .catch((error) => console.error(error));
    },

    sendClosedIntervention (data) {
        let response = {
            body: {
                name: data.agent.name,
                intro: ["Votre intervention à été cloturé", ""],
                signature: false,
                action: {
                    instructions: 'Télécharger le rapport d\'intervention',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'PDF',
                        link: process.env.API_LINK + '/' + data._id + '/' + data._id + '.pdf'
                    }
                },
            },
        };

        let mail = MailGenerator.generate(response);

        let message = {
            from: 'noreply.eviticket@gmail.com',
            to: data.contact.mail,
            subject: "Votre rapport d'intervention",
            html: mail,
        };

        transporter
            .sendMail(message)
            .then(() => {
                console.log('c parti')
            })
            .catch((error) => console.error(error));
    },

    sendPlanificatedIntervention (data) {
        let response = {
            body: {
                name: data.name,
                intro: ["Une intervention à été planifié par " + data.agent.name + ' le ' + data.interventionDate + ' à ' + data.interventionTime, ""],
                signature: false,
                //outro: "Nous vous conseillons vivement de changer ce mot de passe généré de manière automatique pour des raisons de sécurité"
            },
        };

        let mail = MailGenerator.generate(response);

        let message = {
            from: 'noreply.eviticket@gmail.com',
            to: data.contact.mail,
            subject: "Votre compte eviticket",
            html: mail,
        };

        transporter
            .sendMail(message)
            .then(() => {
                console.log('c parti')
            })
            .catch((error) => console.error(error));
    }
}


module.exports = mailController
