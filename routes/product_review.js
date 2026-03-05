const express = require('express');
const ProductReview = require('../models/product_review');
const productReviewRouter = express.Router();
productReviewRouter.post('/api/product-review', async (req, res) => {
    try {
        const { buyerId, email, rating, fullName, productId, review } = req.body;
        const productReview = new ProductReview({
            buyerId,
            email,
            rating,
            fullName,
            productId,
            review
        });
        await productReview.save();
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