const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Importer le module cors
const bcrypt = require('bcrypt');
const app = express();
app.use(cors()); // Utiliser le middleware cors
app.use(express.json());
require('dotenv').config();
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;
const client = new MongoClient(url);

app.get('/', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();
      res.json(documents);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } 
    
  });
       
    

  app.post('/add', async (req, res) => {
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      const email = 'Jennifer@proxeaam.fr';
      const password = 'test';
  
      // Utiliser la méthode "hash" de bcrypt pour hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10); // Le deuxième paramètre est le nombre de tours de hachage à effectuer
  
      const utilisateur = { email: email, mdp: hashedPassword }; // Utiliser le mot de passe haché dans le document à insérer
  
      // Utiliser la méthode "insertOne" pour insérer le document dans la collection
      const result = await collection.insertOne(utilisateur);
      console.log('Utilisateur ajouté avec succès', result);
      res.status(200).send('Utilisateur ajouté avec succès');
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de l\'ajout de l\'utilisateur');
    }
  });


  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body; // Récupérer les données d'email et de mot de passe depuis le corps de la requête
  
      // Effectuer la logique de validation du mot de passe en comparant avec la valeur stockée dans la base de données
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      const utilisateur = await collection.findOne({ email: email });
      if (utilisateur) {
        const match = await bcrypt.compare(password, utilisateur.mdp); // Comparer le mot de passe saisi avec le mot de passe stocké haché dans la base de données
        if (match) {
          res.json({ success: true, message: 'Connexion réussie' });
        } else {
          res.json({ success: false, message: 'Email ou mot de passe incorrect' });
        }
      } else {
        res.json({ success: false, message: 'Email ou mot de passe incorrect' });
      }
    }
     catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
    }
  });

  app.listen(3001, () => {
    console.log('Server started on port http://localhost:3001');
  }
    );

  
      