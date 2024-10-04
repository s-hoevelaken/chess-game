const { query } = require('../db');

exports.findByEmail = async (email) => {
  const results = await query('SELECT * FROM users WHERE email = ?', [email]);
  return results[0];
};

exports.createUser = async (username, email, hashedPassword, elo = 600) => {
  const result = await query(
    'INSERT INTO users (username, email, password, elo) VALUES (?, ?, ?, ?)', 
    [username, email, hashedPassword, elo]
  );
  return result;
};