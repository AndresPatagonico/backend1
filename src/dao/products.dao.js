const productModel = require('../models/product.model.js');

class ProductsDAO {
    async getAll(filter, options) {
        return await productModel.paginate(filter, options);
    }

    async getById(id) {
        return await productModel.findById(id);
    }

    async create(data) {
        return await productModel.create(data);
    }

    async update(id, data) {
        return await productModel.updateOne({ _id: id }, data);
    }

    async delete(id) {
        return await productModel.deleteOne({ _id: id });
    }

    async findRaw() {
        return await productModel.find().lean();
    }
}

module.exports = new ProductsDAO();