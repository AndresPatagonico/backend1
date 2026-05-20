const express = require('express');
const router = express.Router();
const cartsDAO = require('../dao/carts.dao.js');

router.post('/', async (req, res) => {
    try {
        const newCart = await cartsDAO.create();
        res.status(201).send({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartsDAO.getByIdWithPopulate(req.params.cid);
        if (!cart) return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartsDAO.getById(req.params.cid);
        if (!cart) return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });

        const productId = req.params.pid;
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        res.send({ status: 'success', message: 'Producto agregado al carrito', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartsDAO.getById(req.params.cid);
        if (!cart) return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
        await cart.save();
        res.send({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cart = await cartsDAO.update(req.params.cid, { products: req.body.products });
        if (!cart) return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
        res.send({ status: 'success', message: 'Carrito actualizado', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartsDAO.getById(req.params.cid);
        if (!cart) return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.send({ status: 'success', message: 'Cantidad actualizada', payload: cart });
        } else {
            res.status(404).send({ status: 'error', error: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartsDAO.update(req.params.cid, { products: [] });
        if (!cart) return res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
        res.send({ status: 'success', message: 'Carrito vaciado exitosamente', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

module.exports = router;