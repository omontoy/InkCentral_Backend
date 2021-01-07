const { model, Schema, models } = require('mongoose')

const emailRegexp  = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;


const artistSchema = new Schema({
  image: String,
  name: String,
  nickname: String,
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
  location: String,
  phone: String,
  instagram: String,
  facebook: String,
  twitter: String,
  whatsapp: String,
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