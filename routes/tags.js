const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'createdAt';
    const skip = (page - 1) * limit;
    const tags = await Tag.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const total = await Tag.countDocuments();
    const pages = Math.ceil(total / limit);
    res.json({
      success: true,
      data: tags,
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

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Tag name is required' });
    }
    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    if (existingTag) {
      return res.status(409).json({ success: false, error: 'Tag already exists' });
    }
    const tag = new Tag({ name });
    const savedTag = await tag.save();
    res.status(201).json({
      success: true,
      data: savedTag
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    res.json({
      success: true,
      data: tag
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Tag name is required' });
    }
    const existingTag = await Tag.findOne({ name: name.toLowerCase(), _id: { $ne: req.params.id } });
    if (existingTag) {
      return res.status(409).json({ success: false, error: 'Tag name already exists' });
    }
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    res.json({
      success: true,
      data: tag
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    res.json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 