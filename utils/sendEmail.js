const nodemailer = require("nodemailer");

const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'verona54@ethereal.email',
            pass: 'XwWu5j6eHCAmU9wmmc'
        }
    })

    const mailOptions = {
        from: "surya2710@gmail.com",
        to: options.email,
        subject: options.subject,
        text:options.message,
    }


    await transporter.sendMail(mailOptions);


}


module.exports = sendEmail;


