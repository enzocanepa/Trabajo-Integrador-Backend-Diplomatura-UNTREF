require('dotenv').config();            // Cargar variables de entorno desde un archivo .env
const mongoose = require('mongoose');  // Importar mongoose

process.loadEnvFile();

const uri = process.env.MONGODB_URLSTRING;
const db = process.env.DATABASE_NAME;

const conectDB = mongoose.connect(uri + db)
        .then(i=> console.log("Conexión con MongoDB exitosa"))
        .catch(err => console.error("Error al conectarse con MongoDB" + err));

module.exports = conectDB;