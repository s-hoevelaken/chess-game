const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    res.sendFile(path.join(__dirname, "../public/home.html"));
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/session-info", (req, res) => {
  if (req.session.isLoggedIn) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

module.exports = router;
