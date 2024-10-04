const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");

exports.postRegister = async (req, res) => {
  console.log("POST /register hit");
  console.log("Request body:", req.body);

  const { username, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Email already in use" }] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.createUser(username, email, hashedPassword);

    res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

exports.postLogin = async (req, res) => {
  console.log("POST /login hit");
  console.log("Request body received from client:", req.body);

  const { email, password } = req.body;
  console.log("Extracted email:", email);
  console.log("Extracted password:", password);

  try {
    console.log("About to query the database for the user with email:", email);
    const user = await User.findByEmail(email);

    console.log("Database query result:", user);
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid email or password." }] });
    }

    console.log("User found, now comparing passwords...");
    const doMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", doMatch);

    if (!doMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid email or password." }] });
    }

    req.session.isLoggedIn = true;
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      elo: user.elo,
    };

    console.log("Session created:", req.session);

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login process:", error);
    return res.status(500).json({ message: "Internal server error, try again later" });
  }
};
