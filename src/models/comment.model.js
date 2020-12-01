const { model, Schema, models } = require('mongoose')

const commentSchema = new Schema ({
  note: String,
  /*
  artistDestination: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },*/
  clientAuthor: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  }
}, {
  timestamps: true
})

const Comment = model('Comment', commentSchema)

module.exports = Comment