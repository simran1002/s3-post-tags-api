const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Tag name cannot be more than 50 characters']
  }
}, {
  timestamps: true
});

tagSchema.index({ name: 1 });

tagSchema.pre('save', function(next) {
  this.name = this.name.toLowerCase();
  next();
});

module.exports = mongoose.model('Tag', tagSchema); 