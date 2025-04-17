const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    console.log('User created:', user);
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ error: err.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    console.log('User updated:', updated);
    res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    console.log('Fetched users:', users.length);
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
