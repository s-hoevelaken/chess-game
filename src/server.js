const express = require('express');
const path = require('path');
const router = require('./router');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});