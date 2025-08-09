const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Tag = require('../models/Tag');
const { upload, uploadToS3, deleteFromS3 } = require('../utils/s3Upload');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-createdAt';
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: 'i' };
    }
    if (req.query.tags) {
      const tagIds = req.query.tags.split(',').map(id => id.trim());
      filter.tags = { $in: tagIds };
    }
    const posts = await Post.find(filter)
      .populate('tags', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const total = await Post.countDocuments(filter);
    const pages = Math.ceil(total / limit);
    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { desc: { $regex: q, $options: 'i' } }
      ]
    };
    const posts = await Post.find(searchQuery)
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Post.countDocuments(searchQuery);
    const pages = Math.ceil(total / limit);
    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/by-tag/:tagId', async (req, res) => {
  try {
    const { tagId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    const posts = await Post.find({ tags: tagId })
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Post.countDocuments({ tags: tagId });
    const pages = Math.ceil(total / limit);
    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, desc, tags } = req.body;
    if (!title || !desc) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }
    let imageUrl = null;
    if (req.file) {
      try {
        imageUrl = await uploadToS3(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
      } catch (uploadError) {
        return res.status(500).json({ success: false, error: 'Failed to upload image' });
      }
    }
    let tagIds = [];
    if (tags) {
      const tagNames = tags.split(',').map(tag => tag.trim());
      const existingTags = await Tag.find({ name: { $in: tagNames } });
      tagIds = existingTags.map(tag => tag._id);
    }
    const post = new Post({
      title,
      desc,
      image: imageUrl,
      tags: tagIds
    });
    const savedPost = await post.save();
    await savedPost.populate('tags', 'name');
    res.status(201).json({
      success: true,
      data: savedPost
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('tags', 'name');
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, desc, tags } = req.body;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    if (title) post.title = title;
    if (desc) post.desc = desc;
    if (req.file) {
      if (post.image) {
        await deleteFromS3(post.image);
      }
      try {
        const imageUrl = await uploadToS3(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        post.image = imageUrl;
      } catch (uploadError) {
        return res.status(500).json({ success: false, error: 'Failed to upload image' });
      }
    }
    if (tags) {
      const tagNames = tags.split(',').map(tag => tag.trim());
      const existingTags = await Tag.find({ name: { $in: tagNames } });
      post.tags = existingTags.map(tag => tag._id);
    }
    const updatedPost = await post.save();
    await updatedPost.populate('tags', 'name');
    res.json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    if (post.image) {
      await deleteFromS3(post.image);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 