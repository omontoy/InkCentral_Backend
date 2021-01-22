const nodemailer = require('nodemailer');


exports.transporter = nodemailer.createTransport({
    host: 'smtp.aol.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
})

exports.welcome = (user) => {
  return {
    from: `"${process.env.MAIL_USERNAME}" <${process.env.MAIL_USER}>`,
    to: user.email,
    subject: 'Welcome',
    html: `
      <div>
        <h1>Welcome to InkCentral</h1>
        <p>It is a pleasure for us, for you to start being part of the Ink family</p>
      </div>
    `,
    text: `Welcome\n\n${user.name}`,
  }
}

exports.updateConfirmation = (user) => {
  return {
    from:`"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Your profile with InkCentral has been updated!",
    html:`
      <div>
        <h1>${user.name}</h1>
        <p>Your personal information has been updated and saved to our database.</p>
      </div>
    `
  }
}

exports.hideConfirmation = ( email ) => {
  return {
    from:`"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your profile with InkCentral has been hidden!",
    html:`
      <div>
        <p>Your profile has been set to hide in our database.</p>
        <p>We hope see you soon in our platform.</p>
      </div>
    `
  }
}

exports.enableConfirmation = ( email ) => {
  return {
    from:`"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your profile with InkCentral has been enabled!",
    html:`
      <div>
      <p>Welcome Again.</p>  
      <p>Your profile has been set visible in our database.</p>
      </div>
    `
  }
}

exports.sendClientResetEmail = (user, token) => {
  return {
    from:`"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Link To Reset Password",
    html:`
      <div>
        <h1>Reset Password</h1>
        <p>Please click on the following link, or past this into your browser to complete the process within one hour of receiving it: </p>
        <p>http://localhost:3000/clients/reset/${token}</p>
      </div>
    `
  }
}

exports.sendArtistResetEmail = (user, token) => {
  return {
    from:`"${process.env.MAIL_USERNAME}"<${process.env.MAIL_USER}>`,
    to: user.email,
    subject: "Link To Reset Password",
    html:`
      <div>
        <h1>Reset Password</h1>
        <p>Please click on the following link, or past this into your browser to complete the process within one hour of receiving it: </p>
        <p>http://localhost:3000/artists/reset/${token}</p>
      </div>
    `
  }
}