process.loadEnvFile();
const { mongoose, Product } = require("./product.js");

const uri = process.env.MONGODB_URLSTRING;
const db = process.env.DATABASE_NAME;

const dbConnection = mongoose.connect(uri + db)
        .then(i=> console.log("Conexión a la base de datos!"))
        .catch(err => console.error("Error al conectar!" + err));

module.exports = {dbConnection};