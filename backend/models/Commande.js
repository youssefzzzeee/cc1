const mongoose = require('mongoose');

// Define line item schema (LigneCommande)
const LigneCommandeSchema = new mongoose.Schema({
  produit: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Produit', 
    required: true 
  },
  quantite: { 
    type: Number, 
    required: true,
    min: 1
  }
});

// Define order schema
const CommandeSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    default: Date.now 
  },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',
    required: true
  },
  lignesCommande: [LigneCommandeSchema]
});

module.exports = mongoose.model('Commande', CommandeSchema);