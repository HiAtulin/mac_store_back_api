const express = require('express');
const Order = require('../models/order');
const orderRouter = express.Router();
orderRouter.post('/api/orders', async (req, res) => {
    try {
        const { fullName,
            email,
            state,
            city,
            locality,
            productName,
            productPrice,
            quantity,
            category,
            image,
            buyerId,
            vendorId } = req.body;
        const createdAt = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
        const order = new Order({
            fullName,
            email,
            state,
            city,
            locality,
            productName,
            productPrice,
            quantity,
            category,
            image,
            buyerId,
            vendorId,
            createdAt
        });
        await order.save();
        res.status(201).json(order);    

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
orderRouter.get('/api/orders/:buyerId', async (req, res) => {
    try {
        const { buyerId } = req.params;
        const orders = await Order.find({ buyerId });
        if (orders.length == 0) {
            return res.status(404).json({ error: 'No orders found for this buyer' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = orderRouter;