const express = require('express');
const path = require('path');
const authController = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/login', authController.postLogin);

router.post('/register', authController.postRegister);  

module.exports = router;