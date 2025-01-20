const mongoose = require("mongoose");
const User = mongoose.model("User");
const { newAccessToken } = require("../utils/jwt");
const { authSchema } = require("../utils/validationSchema");

const registerUser = async (req, res) => {
  try {
    const sanitized = await authSchema.validateAsync(req.body);

    const existingUser = await User.findOne({ email: sanitized.email });

    if (existingUser) {
      return res.status(409).send({
        message: "This email already exist. Please use another email address",
      });
    }

    const user = await new User({
      name: sanitized.name,
      email: sanitized.email,
      password: sanitized.password,
    }).save();

    const token = newAccessToken(user._id);

    res.status(200).send({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    if (err.isJoi === true) {
      return res.status(422).send({ error: err });
    }
    res.status(500).send({ error: err });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser || !(await existingUser.comparePassword(password)))
      return res.status(401).send({
        message: "Invalid email or password",
      });

    const token = newAccessToken(existingUser._id);

    res.status(200).send({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
