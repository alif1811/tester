const conn = require('../config/database');

exports.loginAuthor = (data) => {
  const sql = 'SELECT * FROM author WHERE username = ? AND password = ?';

  return new Promise((resolve, reject) => {
    conn.query(sql, [data.username, data.password], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};