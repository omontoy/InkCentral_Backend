const { model, Schema, models } = require('mongoose')

const emailRegexp  = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const artistSchema = new Schema({
  image: {
    type: [String],
    default: []
  },
  name: {
    type: String,
    default: ''
  },
  nickname: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    required: true,
    match: [emailRegexp, 'Invalid Email'],
    validate: [
      {
        validator(value){
          return models.Artist.findOne( { email: value })
            .then(artist => !artist)
            .catch(() => false )
        },
        message: "Email already exists"
      }
    ]
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  instagram: {
    type: String,
    default: ''
  },
  facebook: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  quote: {
    type: String,
    default: ''
  },
  whatsapp: {
    type: String,
    default: ''
  },
  notes: {
    type: [{type: Schema.Types.ObjectId,
    ref: 'Comment'
    }],
    required: true,
  },
  payments: {
    type: [{ type: Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  required: true,
  }
}, {
  timestamps: true
})

const Artist = model('Artist', artistSchema)

module.exports = Artist