const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

//generar token
const generateToken = (data) => {
  const token = jwt.sign(data, 'secret_key_me_lo_invento', { expiresIn: '1h' });  //función propia de jwt
  return token;
};

//verificar token
const verifyToken = (token) => {
  try {
    const verifyT = jwt.verify(token, 'secret_key_me_lo_invento'); //verify() es una función propia de jwt
    return verifyT;
  } catch (error){
    return null
  }
};

//autenticación
const authenticate = (req, res, next) => {
  const tokenBearer = req.headers['authorization'];
  // console.log(token);
  if(!tokenBearer) {
    return res.status(401).json({error: 'No hay token'});
  }
  const token = tokenBearer.split(' ')[1];
  const validateToken = verifyToken(token);
  if(!validateToken) {
    return res.status(401).json({error: 'Token incorrecto'});
  }
  // console.log(validateToken);
  req.user = validateToken;
  next(); //función para mandar los datos del usuario validado a la siguiente función
};


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

//endpoint register
server.post('/register', async (req, resp) => {
  const { email, pass } = req.body;
  const conex = await getConnection();
  const selectUser = 'select * from users where email = ? ';
  const [resultSelect] = await conex.query(selectUser, [email, username]);
  if (resultSelect.length === 0) {
    const passwordHashed = await bcrypt.hash(pass, 10);
    const insertUser =
      'insert into users (email, hashed_password) values (?,?,?)';
    const [resultInsert] = await conex.query(insertUser, [
      email,
      passwordHashed,
    ]);
    resp.json({ success: true, data: resultInsert });
  }
});

//endpoint login 
server.post('/login', async (req, resp) => {
  const { email, pass } = req.body;
  const conex = await getConnection();
  const selectUser = 'select * from users where email = ?';
  const [resultSelect] = await conex.query(selectUser, [email]);
  if (resultSelect.length !== 0) {
    const isOkPass = await bcrypt.compare( pass, resultSelect[0].hashed_password); // //esta es una función propia de bcrypt
    if (isOkPass) {
      // generar token
      const infoToken = {
        id: resultSelect[0].idUsers,
        email: resultSelect[0].email,
      };
      const token = generateToken(infoToken);
      resp.json({
        success: true,
        token: token,
      });
    } else {
      resp.json({
        success: false,
        msj: 'contraseña incorrecta',
      });
    }
  } else {
    resp.json({
      success: false,
      msj: 'correo no existe',
    });
  }
});


//static server
const staticServer = './src/public-react';
server.use(express.static(staticServer));
