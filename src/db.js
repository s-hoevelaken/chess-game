const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chess_game',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const runMigrations = async () => {
  try {
    const migrateUsersTable = require('./migrations/table_migration');
    
    // could be async if needed
    await migrateUsersTable(pool);
    console.log('Migrations run successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
};

async function query(sql, params) {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
  }

module.exports = {
    pool,
    runMigrations,
    query,
  };
  