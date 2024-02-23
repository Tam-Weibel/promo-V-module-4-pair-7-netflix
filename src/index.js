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
server.get('/movies', async(req, res) => {
  const {genre, sort} = req.query;
  console.log(req.query);
  const conex = await connectDB();
  let listMovies = [];
  if ( gender === '') {
      const selectMovie = `SELECT * FROM movies ORDER BY title ${sort}`;
      const [resultMovies] = await conex.query(selectMovie); //no necesito un segundo parámetro porque no tengo un valor variable que sustituir
      listMovies = resultMovies;
  } else {
      const selectMovie = `SELECT * FROM movies WHERE genre = ? ORDER BY title ${sort}`;
      const [resultMovies] = await conex.query(selectMovie, [genre]);
      listMovies = resultMovies;
  }
  console.log(resultMovies);
  conex.end();
  res.json({success: true, movies: listMovies});
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
