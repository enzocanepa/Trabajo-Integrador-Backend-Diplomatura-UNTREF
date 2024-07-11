const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    codigo: Number,
    nombre: String,
    precio: Number,
    categoria: String
})

const Product = mongoose.model('Productos', productSchema);

module.exports = {Product, mongoose};