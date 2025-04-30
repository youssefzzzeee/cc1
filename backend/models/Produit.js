const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  libelle: { 
    type: String, 
    required: true 
  },
  PU: { 
    type: Number, 
    required: true 
  }
});

module.exports = mongoose.model('Produit', ProduitSchema);