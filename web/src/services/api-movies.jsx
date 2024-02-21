// login

const getMoviesFromApi = () => {
  // console.log('Esto es el console log muestrame' data);
  return fetch('//localhost:4000/movies')
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
};

export default objToExport;
