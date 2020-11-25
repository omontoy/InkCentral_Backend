const { model, Schema, models } = require('mongoose')

const emailRegexp  = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const clientSchema = new Schema ({
  name: String,
  email: {
    type: String,
    required: true,
    match: [emailRegexp, 'Invalid Email'],
    validate: [
      {
        validator(value){
          return models.Client.findOne( { email: value } )
            .then(client => !client)
            .catch(() => false)
        },
        message: "Email already exists"
      }
    ]
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