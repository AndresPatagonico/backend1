require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { engine } = require('express-handlebars');
const { Server } = require('socket.io');
const path = require('path');

const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const productsDAO = require('./dao/products.dao.js');

const app = express();
const PORT = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a la base de datos de MongoDB'))
    .catch(error => console.error('Error en la conexión:', error));

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);

io.on('connection', async (socket) => {
    console.log('¡Nuevo cliente conectado por WebSockets!');
    
    const products = await productsDAO.findRaw();
    socket.emit('updateProducts', products);

    socket.on('newProduct', async (product) => {
        try {
            await productsDAO.create(product);
            const updatedProducts = await productsDAO.findRaw();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al crear producto por WebSockets:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await productsDAO.delete(productId);
            const updatedProducts = await productsDAO.findRaw();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al eliminar producto por WebSockets:', error);
        }
    });

    socket.on('updateProduct', async ({ id, data }) => {
        try {
            await productsDAO.update(id, data);
            const updatedProducts = await productsDAO.findRaw();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al actualizar producto por WebSockets:', error);
        }
    });
});