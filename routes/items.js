const express = require("express");
const Item = require("../models/Item");
const auth = require("../middleware/auth");

const router = express.Router();

// Create an item
router.post("/", auth, async (req, res) => {
  const { name, description } = req.body;

  try {
    const newItem = new Item({ name, description, user: req.user.id });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all items
router.get("/", auth, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an item
router.put("/:id", auth, async (req, res) => {
  const { name, description } = req.body;

  try {
    const item = await Item.findById(req.params.id);

    if (!item || item.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.name = name;
    item.description = description;
    await item.save();

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an item
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item || item.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.remove();

    res.status(200).json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
