const cartModel = require('../models/cart.model.js');

class CartsDAO {
    async create() {
        return await cartModel.create({ products: [] });
    }

    async getByIdWithPopulate(id) {
        return await cartModel.findById(id).populate('products.product');
    }

    async getById(id) {
        return await cartModel.findById(id);
    }

    async update(id, data) {
        return await cartModel.findByIdAndUpdate(id, data, { new: true });
    }
}

module.exports = new CartsDAO();