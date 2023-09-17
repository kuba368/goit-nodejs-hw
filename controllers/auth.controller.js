const HttpError = require("../helpers/HttpError");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const path = require("node:path");
const fs = require("node:fs").promises;
const config = require("../config/config");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../services/sendEmail");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return HttpError(400, "Incorrect login or password");
  }

  if (!user.verify) {
    return res.status(403).json({
      statusText: "",
      code: 403,
      ResponseBody: {
        message: "E-mail is not verified",
      },
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const secret = process.env.SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "23h" });
  return res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();

  if (user) {
    return HttpError(409, "Email is already in use");
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const mail = {
      to: email,
      subject: "Verification link",
      html: `<a target="_blank" href="http://localhost:${process.env.PORT}/api/users/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(mail);

    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        email: newUser.email,
        subscription: newUser.subscription,
        messsage: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, { token: "" });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(204).json({
    messsage: "Logout successful",
  });
};

const current = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;
  res.status(200).json({
    email,
    subscription,
    avatarURL,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const img = await Jimp.read(tempUpload);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(tempUpload);
  const filename = `${Date.now()}-${originalname}`;
  const resultUpload = path.join(config.AVATARS_PATH, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({
        messsage: "User not found",
      });
    }
    user.set("verify", true);
    user.verificationToken = null;
    await user.save();
    return res.status(200).json({
      messsage: "Verification successful",
    });
  } catch (error) {
    res.status(500).json({
      messsage: "Internal Server Error",
    });
  }
};

const reverifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return HttpError(400, "Missing required field email");
    }
    const user = await User.findOne({ email });

    if (user.verify) {
      return res.status(400).json({
        statusText: "Bad Request",
        code: 400,
        ResponseBody: {
          message: "Verification has already been passed",
        },
      });
    }
    const verificationToken = user.verificationToken;
    send(email, verificationToken);
    res.status(200).json({
      statusText: "OK",
      code: 200,
      ResponseBody: {
        message: "Verification email sent",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  login,
  register,
  current,
  logout,
  updateAvatar,
  verifyEmail,
  reverifyEmail,
};
