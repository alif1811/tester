const mysql = require('mysql');

// Config MySQL sesuaikan dengan konfigurasi masing"
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // default dari XAMPP password kosong ''
  database: 'library',
});

conn.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

module.exports = conn;