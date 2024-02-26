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
  // const conex = await getConnection();
  // const sql = 'SELECT * FROM movies';
  // const [results, fields] = await conex.query(sql);
 
  // const sql2 = 'SELECT * FROM movies WHERE genre = ?';
  // const [result] = await conex.query(sql2, [req.query.genre]);
  // conex.end();
  // res.json({ success: true, data: result });
  const { genre, sort } = req.query;
  console.log(req.query);
  const conex = await getConnection();

  let listMovies = [];
  let selectMovie;
  if (genre === '') {
    selectMovie = `SELECT * FROM movies ORDER BY title ${sort ? sort : ''}`;
    const [resultMovies] = await conex.query(selectMovie);
    listMovies = resultMovies;
  } else {
    selectMovie = `SELECT * FROM movies WHERE genre = ? ORDER BY title ${sort ? sort : ''}`;
    const [resultMovies] = await conex.query(selectMovie, genre ? [genre] : []);
    listMovies = resultMovies;
  }
  conex.end();
  res.json({
    success: true,
    movies: listMovies,
  });
});

server.get('/movie/:idMovies', async(req, res) => {
  console.log(req.params.idMovies);
  const conex = await getConnection();
  const sql = 'SELECT * FROM movies WHERE idMovies = ?';
  const [results] = await conex.query(sql, [req.params.idMovies]);
  conex.end();
  res.render('movie', {data: results[0]});
});


//static server
const staticServer = './src/public-react';
server.use(express.static(staticServer));
