const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  image: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  username: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true });

postSchema.pre('save', function(next) {
  if (!this.likedBy) {
    this.likedBy = [];
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
