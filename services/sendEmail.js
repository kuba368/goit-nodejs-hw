require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "kuba368@gmail.com" };
  await sgMail.send(email);
  return true;
};

module.exports = {
  sendEmail,
};
