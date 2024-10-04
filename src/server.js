const express = require('express');
const path = require('path');
const { startWebSocketServer } = require('./websocketServer');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { pool, runMigrations } = require('./db');
const router = require('./router');

const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutes
  expiration: 86400000, // 24 hours
}, pool);

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { maxAge: 86400000 }
}));


app.use((req, res, next) => {
  console.log('Session data:', req.session);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));


app.use(router);

startWebSocketServer(server);

runMigrations().then(() => {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to run migrations, shutting down:', err);
  process.exit(1);
});
