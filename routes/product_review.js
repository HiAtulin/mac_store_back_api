const express = require('express');
const ProductReview = require('../models/product_review');
const Product = require('../models/product');
const productReviewRouter = express.Router();
productReviewRouter.post('/api/product-review', async (req, res) => {
    try {
        const { buyerId, email, rating, fullName, productId, review } = req.body;
        const existingReview = await ProductReview.findOne({ buyerId, productId });
        if (existingReview) {
            return res.status(400).json({ msg: "You have already reviewed this product" });
        }
        const productReview = new ProductReview({
            buyerId,
            email,
            rating,
            fullName,
            productId,
            review
        });
        await productReview.save();
        const product = await Product.findById(productId);
        if(!product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        product.totalRatings += 1;
        const averageRating = ((product.averageRating * (product.totalRatings - 1) + rating)) / product.totalRatings;
        product.averageRating = averageRating;
        await product.save();

        res.status(201).send(productReview);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}); 
productReviewRouter.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await ProductReview.find();
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ msg: "No reviews found for this product" });
        } else {
            return res.status(200).json(reviews);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
module.exports = productReviewRouter;