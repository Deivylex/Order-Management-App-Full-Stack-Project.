const orderRoute = require('express').Router()
const order = require('../models/order')
const middleware = require('../utils/middleware')

// Regular user routes
orderRoute.get('/', middleware.userExtractor, async (req, res) => {
    const user = req.user
    const orders = await order.find({ user: user.id }).sort({ orderDate: -1 })
    res.json(orders)
})

orderRoute.post('/', middleware.userExtractor, async(req, res) => {
    const body = req.body
    const user = req.user

    const newOrder = new order({
        customerName: body.customerName,
        phone: body.phone,
        company: body.company,
        tortillaType: body.tortillaType,
        productType: body.productType,
        size: body.size,
        quantity: body.quantity,
        status: body.status || 'pending',
        notes: body.notes,
        user: user.id
    })     
    const response = await newOrder.save()
    res.status(201).json(response);
})

// Admin routes
orderRoute.get('/admin/all', middleware.userExtractor, async (req, res) => {
        const user = req.user
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin role required.' })
        }
        
        const orders = await order.find({}).populate('user', 'name email').sort({ orderDate: -1 })
        res.json(orders)
})

orderRoute.put('/admin/:id/status', middleware.userExtractor, async (req, res) => {
        const user = req.user
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin role required.' })
        }

        const { status } = req.body
        const validStatuses = ['pending', 'completed', 'canceled', 'ongoing']
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' })
        }

        const updatedOrder = await order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email')

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' })
        }

        res.json(updatedOrder)
})

orderRoute.delete('/admin/:id', middleware.userExtractor, async (req, res) => {
        const user = req.user
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin role required.' })
        }

        const deletedOrder = await order.findByIdAndDelete(req.params.id)
        
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' })
        }

        res.status(204).end()
})

module.exports = orderRoute