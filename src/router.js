const express = require('express');
const indexRouter = require('./routes/index');

const router = express.Router();

router.use('/', indexRouter);

module.exports = router;