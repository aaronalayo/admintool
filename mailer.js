const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'editoraaron@gmail.com',
    pass: 'softball'
  }
});



module.exports = function sendEmail(to, subject, message) {
  const mailOptions = {
      from: 'editoraaron@gmail.com',
      to: to,
      subject,
      html: message,
  };
  transporter.sendMail(mailOptions, (error) => {
      if (error) {
          console.log(error);
      }
  });
};