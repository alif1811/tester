const conn = require('../config/database');

exports.readBooks = () => {
  const sql = 'SELECT * FROM books';

  return new Promise((resolve, reject) => {
    conn.query(sql, (err, rows) => {
      if(err) return reject(err);
      resolve(rows)
    })
  })
};

exports.readOneBook = (id) => {
  const sql = 'SELECT * FROM books WHERE id = ?';

  return new Promise((resolve, reject) => {
    conn.query(sql, id, (err, rows) => {
      if(err) return reject(err);
      resolve(rows)
    })
  })
};

exports.createBook = (data) => {
  const sql = 'INSERT INTO books SET ?';

  return new Promise((resolve, reject) => {
    conn.query(sql, data, (err, rows) => {
      if(err) return reject(err);
      resolve(rows)
    })
  })
};

exports.updateBook = (id, data) => {
  const sql = 'UPDATE books SET ? WHERE id = ?';

  return new Promise((resolve, reject) => {
    conn.query(sql, [data, id], (err, rows) => {
      if(err) return reject(err);
      resolve(rows)
    })
  })
};

exports.deleteBook = (id) => {
  const sql = 'DELETE FROM books WHERE id = ?';

  return new Promise((resolve, reject) => {
    conn.query(sql, id, (err, rows) => {
      if(err) return reject(err);
      resolve(rows)
    })
  })
};
