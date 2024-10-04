const express = require('express');
const indexRouter = require('./routes/index'); // name needs change 
const authRouter = require('./routes/authRoutes');
const homeRouter = require('./routes/homeRoutes');

const router = express.Router();

router.use('/', indexRouter);

router.use('/auth', authRouter);

router.use('/home', homeRouter);

module.exports = router;