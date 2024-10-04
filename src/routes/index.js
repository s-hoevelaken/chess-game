const express = require('express');
const path = require('path');

const router = express.Router();

// this route needs to be changed, home.html should be index.html
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
