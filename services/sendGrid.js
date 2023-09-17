require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const send = (email, verificationToken) => {
  sgMail.setApiKey(process.env.API_KEY);
  const msg = {
    to: email,
    from: "kuba368@gmail.com",
    subject: "Verification link",
    text: "",
    html: `<p>Verify your e-mail address by clicking on this link - <a href="http://localhost:${process.env.PORT}/api/users/verify/${verificationToken}"</p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  send,
};
