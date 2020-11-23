const { model, Schema, models } = require('mongoose')

const emailRegexp  = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;


const artistSchema = new Schema({
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
            .catch(()=> false )
        },
        message: "Email already exists"
      }
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: [4,'Password must be more than 4 characters'],
    maxlength: [12,'Password must be less than 12 characters']
  },
  location: String,
  phone: String,
}, {
  timestamps: true
})

const Artist = model('Artist', artistSchema)

module.exports = Artist