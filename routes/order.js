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

orderRouter.delete('/api/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

orderRouter.get('/api/orders/vendors/:vendorId', async (req, res) => {
    try {
        const { vendorId } = req.params;
        const orders = await Order.find({ vendorId });
        if (orders.length == 0) {
            return res.status(404).json({ error: 'No orders found for this vendor' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

orderRouter.patch('/api/orders/:id/delivered', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(id, { delivered: true ,processing : false}, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }else {
            res.status(200).json(updatedOrder);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

orderRouter.patch('/api/orders/:id/processing', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(id, { processing: false, delivered: false }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }else {
            res.status(200).json(updatedOrder);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = orderRouter;