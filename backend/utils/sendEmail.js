const nodemailer = require('nodemailer')

const sendMail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Gmail以外の場合は host / port を明示
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `"TuneMiner" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  })
}

module.exports = sendMail

