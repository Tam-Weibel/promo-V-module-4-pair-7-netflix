const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// create and config server
const server = express();
server.use(cors());
server.set('view engine', 'ejs');
server.use(express.json());

//connect db
async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'r00t',
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

server.get('/movie/:idMovies', async(req, res) => {
  console.log(req.params.idMovies);
  const conex = await getConnection();
  const sql = 'SELECT * FROM movies WHERE idMovies = ?';
  const [results] = await conex.query(sql, [req.params.idMovies]);
  conex.end();
  // res.json(results);
  res.render('movie', {data: results[0]});
});


//static server
const staticServer = './src/public-react';
server.use(express.static(staticServer));
