const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  customerName: String,
  phone: String,
  company: String,
  tortillaType: { type: String, enum: ['white', 'blue'] },
  productType: { type: String, enum: ['tortilla', 'nacho'] },
  size: { type: String, enum: ['12', '18'] },
  quantity: Number,
  orderDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'canceled', 'ongoing'], default: 'pending' },
  notes: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }
})

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const order = mongoose.model('order', orderSchema)

module.exports = order