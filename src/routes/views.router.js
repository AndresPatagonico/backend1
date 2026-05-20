const express = require('express');
const router = express.Router();
const productsDAO = require('../dao/products.dao.js');

router.get('/', async (req, res) => {
    try {
        const products = await productsDAO.findRaw();
        res.render('home', { title: 'Inicio - Catálogo', products });
    } catch (error) {
        res.status(500).send('Error al cargar la vista');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        res.render('realTimeProducts', { title: 'Productos en Tiempo Real' });
    } catch (error) {
        res.status(500).send('Error al cargar la vista');
    }
});

module.exports = router;