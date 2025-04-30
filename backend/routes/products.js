const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Produit.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Produit.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  const product = new Produit({
    libelle: req.body.libelle,
    PU: req.body.PU
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;