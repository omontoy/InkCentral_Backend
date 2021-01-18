const { model, Schema } = require('mongoose')

const paymentSchema = new Schema ({
  amount: {
    type: String,
    required: true
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  consumer: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  service: {
    type: String,
    required: true
  }, 
  invoiceNumber: {
    type: String,
    required: true
  },
  schedule: {
    type: Date,
    required: true
  },  
},{
  timestamps: true
})

const Payment = model('Payment', paymentSchema)

module.exports = Payment