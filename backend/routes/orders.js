const express = require('express');
const router = express.Router();
const Commande = require('../models/Commande');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Commande.find()
      .populate('client')
      .populate('lignesCommande.produit');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Commande.findById(req.params.id)
      .populate('client')
      .populate('lignesCommande.produit');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  const order = new Commande({
    client: req.body.client,
    lignesCommande: req.body.lignesCommande
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;