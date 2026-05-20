const express = require('express');
const router = express.Router();
const productsDAO = require('../dao/products.dao.js');

router.get('/', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        let filter = {};
        if (query) {
            if (query === 'true' || query === 'false') {
                filter.status = query === 'true';
            } else {
                filter.category = query;
            }
        }

        let options = { limit, page, lean: true };
        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const result = await productsDAO.getAll(filter, options);

        res.send({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
        });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productsDAO.create(req.body);
        res.status(201).send({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productsDAO.getById(req.params.pid);
        if (!product) return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
        res.send({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updateProduct = req.body;
        delete updateProduct._id;
        const result = await productsDAO.update(req.params.pid, updateProduct);
        if (result.matchedCount === 0) return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
        res.send({ status: 'success', message: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const result = await productsDAO.delete(req.params.pid);
        if (result.deletedCount === 0) return res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
        res.send({ status: 'success', message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

module.exports = router;