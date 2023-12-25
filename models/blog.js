const mongoose = require('mongoose')
const REGEX_URL = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/

const blogSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    validate: {
      validator: (url) => REGEX_URL.test(url),
      message: (props) => `${props.value} is not a valid URL!`,
    }
  },
  title: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => { // eslint-disable-line no-unused-vars
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)