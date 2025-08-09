const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  desc: {
    type: String,
    required: [true, 'Post description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  image: {
    type: String,
    default: null
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }]
}, {
  timestamps: true
});

postSchema.index({ title: 'text', desc: 'text' });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

postSchema.virtual('tagNames', {
  ref: 'Tag',
  localField: 'tags',
  foreignField: '_id',
  justOne: false
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema); 