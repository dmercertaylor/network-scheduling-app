const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE || 'gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
});

module.exports = (email, textContents, htmlContents) => {
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: email,
        subject: "You're Weekly Connections!",
        text: textContents,
        html: htmlContents || undefined
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err);
        }
    });
}