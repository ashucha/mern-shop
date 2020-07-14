const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User model
const User = require("../../models/User");

// Validation
const { registrationValidation, loginValidation } = require("../../validation");

// @route POST api/auth/register
// @desc Create an user
// @access Public
router.post("/register", async (req, res) => {
  // Registration validation
  const { error } = registrationValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check for duplicate user
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(400).send("User with same email already exists");
  else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    newUser
      .save()
      .then((user) => res.json({ success: true }))
      .catch((err) => res.status(400).json({ success: false, error: err }));
  }
});

// @route POST api/auth/login
// @desc Log a user in
// @access Public
router.post("/login", async (req, res) => {
  // Login validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error);

  // Check for valid email credential
  const user = await User.findOne({ email: req.body.email });

  // Check for valid password credential
  const validPwd = await bcrypt.compare(req.body.password, user.password);
  if (!(user && validPwd)) return res.status(400).send("Invalid credentials.");

  // Create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
