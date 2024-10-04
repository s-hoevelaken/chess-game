module.exports = async (dbConnection) => {
    return new Promise((resolve, reject) => {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          elo INT DEFAULT 600,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;
  
      dbConnection.query(createTableSQL, (error, result) => {
        if (error) {
          console.error('Error creating users table:', error);
          reject(error);
        } else {
          console.log('Users table created or already exists.');
          resolve(result);
        }
      });
    });
  };
  