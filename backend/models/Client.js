const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number, 
    required: true 
  },
  emails: [{ 
    type: String 
  }]
});

module.exports = mongoose.model('Client', ClientSchema);