const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

//connect db
async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '91-6320469%gR',
    database: 'Netflix',
  });
  connection.connect();
  return connection;
}

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//endpoints
server.get('/movies', async (req, res) => {
  const conex = await getConnection();
  const sql = 'SELECT * FROM movies';
  const [results, fields] = await conex.query(sql);
 
  const sql2 = 'SELECT * FROM movies WHERE genre = ?';
  const [result] = await conex.query(sql2, [req.query.genre]);
  conex.end();
  res.json({ success: true, data: result });
});

// app.get('/movies', async (req,res) => {
//   const conex = await getConnection();
//   const sql = 'SELECT * FROM movies WHERE genre = ?';
//   const [result] = await conex.query(sql, [req.query.genre]);
//   res.json({result: result});
// });

//static server
const staticServer = './web';
server.use(express.static(staticServer));
