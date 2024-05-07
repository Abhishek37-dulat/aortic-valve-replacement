const User = require("../model/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidIndianPhoneNumber(phone) {
  const indianPhoneRegex = /^\d{3}\d{3}\d{4}$/;
  return indianPhoneRegex.test(phone);
}
const RegisterUser = async (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;
  if (!first_name || !email || !password || !confirm_password) {
    return res.status(400).json({ msg: "all fields are required!" });
  }
  if (email) {
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "please enter valid Email!" });
    }
    const existing_user = await User.findOne({ email: email });
    if (existing_user) {
      return res
        .status(400)
        .json({ msg: "User with this Email allready Exists!" });
    }
  }
  if (password !== confirm_password) {
    return res
      .status(400)
      .json({ msg: "password and confirm password don't match!" });
  }
  try {
    const hassedPassword = await bcrypt.hash(password, 10);

    const newuser = await new User({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hassedPassword,
    });
    const data = await newuser.save();
    return res.status(200).json({ msg: "Sign Up Successfull", data: data });
  } catch (error) {
    return res.status(500).json({ msg: "Error while Sign Up", error: error });
  }
};

const LoginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userExits = await User.findOne({
      $or: [{ email: username }, { phone: username }],
    });

    if (!username || !password) {
      return res.status(400).json({ msg: "all fields are required!" });
    }
    if (!userExits) {
      return res
        .status(400)
        .json({ msg: "username or password doesn't match!" });
    }
    const passwordCheck = bcrypt.compare(password, userExits.password);
    if (!passwordCheck) {
      return res
        .status(400)
        .json({ msg: "username or password doesn't match" });
    }
    console.log("userExits: ", userExits);
    let token = jwt.sign({ userExits }, process.env.SECRET_TOKEN_KEY);

    return res.status(200).json({
      msg: "Login successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "not able to Login internal server error!", error: error });
  }
};

module.exports = { RegisterUser, LoginUser };
