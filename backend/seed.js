const mongoose = require('mongoose');
const Client = require('./models/Client');
const Produit = require('./models/Produit');
const Commande = require('./models/Commande');

// Connection URI - using the newer connection syntax and removing deprecated options
const uri = 'mongodb://127.0.0.1:27017/test';

console.log('Attempting to connect to MongoDB...');

// Connect to MongoDB with updated options and better error handling
mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Call the seed function after successful connection
    seedDB();
  })
  .catch(err => {
    console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection error:');
    console.error(err);
    console.log('\n');
    console.log('\x1b[33m%s\x1b[0m', 'TROUBLESHOOTING TIPS:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Check if MongoDB service is started:');
    console.log('   - Open Services app in Windows');
    console.log('   - Look for "MongoDB Server" and ensure it\'s running');
    console.log('3. Or start MongoDB manually:');
    console.log('   - Run: mongod --dbpath="C:\\data\\db"');
    console.log('   (You may need to create this directory first)');
    console.log('4. If using MongoDB Atlas, check your internet connection');
    process.exit(1);
  });

// Sample clients
const clients = [
  {
    nom: 'Entreprise ABC',
    age: 15, // years in business
    emails: ['contact@abc.com', 'info@abc.com']
  },
  {
    nom: 'Société XYZ',
    age: 8,
    emails: ['contact@xyz.com']
  },
  {
    nom: 'Martin Dupont',
    age: 42,
    emails: ['martin.dupont@email.com']
  },
  {
    nom: 'TechSolutions Inc.',
    age: 5,
    emails: ['support@techsolutions.com', 'sales@techsolutions.com']
  },
  {
    nom: 'Boulangerie Parisienne',
    age: 25,
    emails: ['contact@boulangerie-parisienne.fr']
  },
  {
    nom: 'Librairie des Savoirs',
    age: 12,
    emails: ['info@librairie-savoirs.com']
  }
];

// Sample products
const produits = [
  {
    libelle: 'Ordinateur portable',
    PU: 899.99
  },
  {
    libelle: 'Moniteur 27"',
    PU: 249.50
  },
  {
    libelle: 'Clavier mécanique',
    PU: 99.90
  },
  {
    libelle: 'Souris sans fil',
    PU: 35.00
  },
  {
    libelle: 'Disque SSD 1TB',
    PU: 129.99
  },
  {
    libelle: 'Casque audio',
    PU: 79.99
  },
  {
    libelle: 'Imprimante laser',
    PU: 199.50
  },
  {
    libelle: 'Webcam HD',
    PU: 59.90
  },
  {
    libelle: 'Pack Office',
    PU: 149.00
  },
  {
    libelle: 'Antivirus - Licence annuelle',
    PU: 45.00
  }
];

// Delete existing data and seed new data
const seedDB = async () => {
  try {
    console.log('Starting database seeding process...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await Client.deleteMany({});
    await Produit.deleteMany({});
    await Commande.deleteMany({});
    console.log('✓ Existing data cleared');

    // Insert new data
    console.log('Inserting new sample data...');
    const createdClients = await Client.insertMany(clients);
    const createdProducts = await Produit.insertMany(produits);
    
    console.log(`✓ Seeded ${createdClients.length} clients`);
    console.log(`✓ Seeded ${createdProducts.length} products`);
    
    // Create some sample orders
    const orders = [
      {
        client: createdClients[0]._id,
        date: new Date('2025-04-15'),
        lignesCommande: [
          {
            produit: createdProducts[0]._id,
            quantite: 2
          },
          {
            produit: createdProducts[2]._id,
            quantite: 2
          },
          {
            produit: createdProducts[3]._id,
            quantite: 2
          }
        ]
      },
      {
        client: createdClients[1]._id,
        date: new Date('2025-04-20'),
        lignesCommande: [
          {
            produit: createdProducts[1]._id,
            quantite: 3
          },
          {
            produit: createdProducts[4]._id,
            quantite: 1
          }
        ]
      },
      {
        client: createdClients[3]._id,
        date: new Date('2025-04-25'),
        lignesCommande: [
          {
            produit: createdProducts[5]._id,
            quantite: 5
          },
          {
            produit: createdProducts[7]._id,
            quantite: 5
          },
          {
            produit: createdProducts[8]._id,
            quantite: 5
          }
        ]
      }
    ];

    const createdOrders = await Commande.insertMany(orders);
    console.log(`✓ Seeded ${createdOrders.length} orders`);
    
    console.log('\n\x1b[32m%s\x1b[0m', 'DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('\nSample data summary:');
    console.log('--------------------');
    console.log('Clients:');
    createdClients.forEach(client => {
      console.log(`- ${client.nom} (${client.age} ans)`);
    });
    
    console.log('\nProducts:');
    createdProducts.forEach(product => {
      console.log(`- ${product.libelle}: ${product.PU.toFixed(2)} €`);
    });
    
    console.log('\nOrders:');
    for(let i = 0; i < createdOrders.length; i++) {
      console.log(`- Order for client: ${clients[i % clients.length].nom}, items: ${orders[i].lignesCommande.length}`);
    }
    
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error seeding database:');
    console.error(error);
  } finally {
    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};