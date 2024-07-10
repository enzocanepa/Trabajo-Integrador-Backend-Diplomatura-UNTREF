const express = require('express');
const connectDB = require('./database');
const Product = require('./product');
const app = express();
require('dotenv').config();
const port = process.env.port ?? 3000; // Puerto

connectDB(); // conexion a mongoDB

// Middleware para parsear json
app.use(express.json());

// GET
//Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Verduleria')
})

//obtener todos los productos
app.get('/product', async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar productos' });
  }
});

//obtener productos por su id
app.get('/product/:id', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar el producto' });
  }
});

// post
app.post('/product', async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ message: 'Error adding product' });
  }
});

// patch
// modificando el precio de un producto
app.patch('/product/:id', async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(req.params.id, { precio: req.body.precio }, { new: true });
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto' });
  }
});

// delete
// borrar un producto
app.delete('/product/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto borrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al borrar el producto' });
  }
});

// Middleware de ruta no encontrada 
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
