const mongoose = require('mongoose')

//Obtenemos la URI desde las variables de entorno
const URI = process.env.MONGODB_URLSTRING
const DATABASE_NAME = process.env.DATABASE_NAME
// Conectar a MongoDB usando Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(URI + DATABASE_NAME);
    console.log('MongoDB se conecto');
  } catch (err) {
    console.error('Falla al conectarse a MongoDB', err);
    process.exit(1); // Detiene la aplicación si no se puede conectar a la base de datos
  }
};

module.exports = connectDB