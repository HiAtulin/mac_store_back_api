const express = require('express');
const Product = require('../models/product');
const productRouter = express.Router();

productRouter.post('/api/add-product', async (req, res) => {
    try {
        console.log(req.body);
        const { productName, productPrice, quantity, description, category, vendorId, fullName, subCategory, images } = req.body;
        const product = new Product({
            productName,
            productPrice,
            quantity,
            description,
            category,
            vendorId,
            fullName,
            subCategory,
            images
        });
        
        await product.save();
        return res.status(201).json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
productRouter.get('/api/popular-products', async (req, res) => {
    try {
        const products = await Product.find({ popular: true });
        if (!products || products.length === 0) {
            return res.status(404).json({ msg: "No popular products found" });
        }
        res.status(200).json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
productRouter.get('/api/recommended-products', async (req, res) => {
    try {
        const products = await Product.find({ recommend: true });
        if (!products || products.length === 0) {
            return res.status(404).json({ msg: "No recommended products found" });
        }
        res.status(200).send(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
productRouter.get('/api/products-by-category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category ,popular: true });
        if (!products || products.length === 0) {
            return res.status(404).json({ msg: "No products found for the specified category" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = productRouter; 