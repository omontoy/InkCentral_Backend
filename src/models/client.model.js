const { model, Schema } = require('mongoose')

const clientSchema = new Schema ({
  name: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  }
}, {
  timestamps: true,
})

const Client = model('Client', clientSchema)

module.exports = Client