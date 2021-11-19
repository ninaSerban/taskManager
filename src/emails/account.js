const mailgun = require("mailgun-js");
const apiKey  = process.env.MAILGUN_API_KEY;
const domain = process.env.DOMAIN;
const mg = mailgun({apiKey, domain});

const sendWelcomeEmail = (email, name) => {
	mg.messages().send({
		from: 'niculina.serban@gmail.com',
		to: email,
		subject: 'Thanks for joining',
		text: `Welcome to the app, ${name}. Let me know how you get along with the app!`
	})
}

const sendCancelationEmail = (email, name) => {
	mg.messages().send({
		from: 'niculina.serban@gmail.com',
		to: email,
		subject: 'Sorry to see you go',
		text: `Adios ${name}!`
	})
}

module.exports = {
	sendWelcomeEmail,
	sendCancelationEmail
}