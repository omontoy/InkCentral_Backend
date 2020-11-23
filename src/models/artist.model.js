const { model, Schema } = require('mongoose')

const artistSchema = new Schema({
  name: String,
  nickname: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  location: String,
  phone: String,
}, {
  timestamps: true
})

const Artist = model('Artist', artistSchema)

module.exports = Artist