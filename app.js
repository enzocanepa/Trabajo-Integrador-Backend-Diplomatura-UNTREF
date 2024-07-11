const express = require("express");
const morgan = require("morgan");
const  Product = require("./product.js")
const conectDB = require("./database.js");
require('dotenv').config(); // Cargar variables de entorno desde un archivo .env

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Frutas y Verduras')
   })

// Todos los productos o filtrado por nombre, categoria
app.get("/producto",async(req,res)=>{
    const { name, category } = req.query;
    try{
    // Productos por nombre
    if(name){
        const nameRegex = new RegExp(`^${name}`, 'i');
        const productName = await Product.find({nombre: {$regex: nameRegex}});
        return res.json(productName);
    }

    // Por categorias
    if(category){
        const productCategory = await Product.find({categoria:category});
        if(!productCategory || productCategory.length === 0) return res.status(404).json({error: "No se encontraron productos con la categoria: " + category});

        return res.json({category: productCategory});
    }

    // Todos los productos
    !Product? res.status(401).json({error:"Productos no encontrados"}): res.json(await Product.find());
    }catch{
        res.status(501).json({error:"Error en el servidor!"});
    }
});


// Productos por ID
app.get("/producto/:id", async (req, res) => {
  const { id } = req.params;
  try {
      const product = await Product.findOne({ codigo: id });
      if (!product) {
          return res.status(404).json({ message: "No se encontró ningun producto con el id: " + id });
      }
      res.json(product);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en la base de datos!" });
  }
});


// Añadiendo productos
app.post("/producto",async(req,res)=>{
  try{
      const newProduct = new Product(req.body);
      if(!newProduct)return res.status(401).json({error:"Es necesario añadir un nuevo producto"});
      const addProduct = await newProduct.save();
      if(addProduct) return res.json({message:"Producto nuevo añadido exitosamente",newProduct});
  }catch{
      res.status(500).json({error:"Error en el servidor al añadir producto"});
  }
});


// Editar un producto
app.patch("/producto/editar/:id", async (req, res) => {
  const { codigo, price, nombre, categoria } = req.body;
  const id  = req.params.id;
  
  try {
      const editProduct = await Product.findOneAndUpdate(
          {codigo:id},
          {
              codigo,
              nombre,
              precio:price,
              categoria
          },
          {new:true}
      );
      
      if (!editProduct) return res.json({ message: "El precio no se pudo actualizar" });
      return res.json({ message: "Producto actualizado", price });
  } catch (error) {
      res.status(500).json({ error: "Error en el servidor al actualizar el producto" });
  }
});


// Borrar un producto
app.delete("/producto/borrar/:id",async(req,res)=>{
  const {id} = req.params;
  try{
      const deleteProduct = await Product.findOneAndDelete({codigo:id});
      if(!deleteProduct) return res.status(404).json({message:"Producto no encontrado"});
      res.json({message:"Producto eliminado exitosamente"});
  }catch(error){
      res.status(500).json({error:"Error en el servidor al borrar el producto"});
  }
});

app.listen(port,()=>{
  console.log(`Aplicacion corriendo ${port}`);
  console.log(`http://localhost:${port}/`);
  console.log(new Date());
  conectDB;
});