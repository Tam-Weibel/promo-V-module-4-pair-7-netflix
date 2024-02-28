const dbConnect = () => {
    const user = 'tamaraweibel';
    const pass = 'vivS6F6CIbJsiDXf';
    const dbName = 'Cluster0';
  
    const uri = `MongoDB+srv://${user}:${pass}@cluster0.jnfdxxm.MongoDB.net/${dbName}?retryWrites=true&w=majority`;
  
    mongoose
      .connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(() => console.log('conectado a MongoDB'))
      .catch((e) => console.log('error de conexión', e));
  };
  module.exports = dbConnect;