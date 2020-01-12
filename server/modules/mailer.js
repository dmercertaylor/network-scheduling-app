const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE || 'gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

module.exports = (email, contents) => {
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: email,
        subject: "Scheduled Email",
        text: contents
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err);
        }
    });
}