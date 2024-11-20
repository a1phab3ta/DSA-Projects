const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');


const app = express();
const port = 3000;
app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const db = mongoose.connection;

// Connect to MongoDB
const dbURI = "mongodb+srv://PranavN:[REDACTED]@cluster0.bye5tda.mongodb.net/inventoryManagement";
// Define the user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    inventories: String
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
// Create the User model
const User = mongoose.model('User', userSchema, "users");
const inventorySchema = new mongoose.Schema({
    id : {
        type: Number,
        required: true},

    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    supplier: {
        type: String,
        required: true,
    }
})

const Inventory = mongoose.model('Inventory', inventorySchema);
// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/FrontEnd.html');
});

//Route for creating an account
app.post('/register', async (req, res) => {
    const { newUsername, newPassword } = req.body;

    try {
        // Check if the username is already taken
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists. Please choose a different username.' });
        }

        // Create a new user
        const newUser = new User({ username: newUsername, password: newPassword, inventories: "" });
        await newUser.save();

        res.status(201).json({ message: 'Account created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Handle user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user in the database
        const user = await User.findOne({ username, password });

        if (user) {
            res.status(200).json({ message: 'Login successful.' });
        } else {
            res.status(401).json({ error: 'Invalid username or password. Please try again.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get names of the inventories that the user has access to
app.get('/getInventoryNames', async (req, res) => {
    try {
        const username = req.headers.authorization.replace('Bearer ', '');

        // Find the user in the database
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const inventoryNames = user.inventories.split(',');

        res.status(200).json({ inventoryNames });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Check if a table with that name already exists in the database
async function checkIfTableExists(tableName) {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();

      for (let i = 0; i < collections.length; i++) {
        if (collections[i].name === tableName) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking table existence:', error);
      return false;
    }
}

app.get('/checkTableExists', async (req, res) => {
    const { tableName } = req.query;
    // Perform a database query to check if the table exists
    const tableExists = await checkIfTableExists(tableName);
    res.send(tableExists?"0":"1")
});

//Create a new collection in the database
app.post('/createNewTable', async (req, res) => {
    const { tableName } = req.body;
    const username = req.query.username;

    try {
        // Check if the table name already exists
        const tableExists = await checkIfTableExists(tableName);
        if (tableExists) {
            return res.status(400).json({ error: 'Table with the same name already exists. Please choose a different name.' });
        }

        // Create a new collection with the specified name
        await mongoose.connection.db.createCollection(tableName);

        // Fetch the current 'inventories' value
        const user = await User.findOne({ username });
        // Default to an empty string if 'inventories' is not set
        let currentInventories = user.inventories || '';

        // Update the user document to append the new tableName to the 'inventories' string
        currentInventories += (currentInventories ? ',' : '') + tableName;
        await User.updateOne({ username }, { $set: { inventories: currentInventories } });

        res.status(201).json({ message: 'Table created successfully.' });
    } catch (error) {
        console.error('Error creating table:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//Get all records in the collection
app.get('/getInventoryRecords', async (req, res) => {
    try {
        // Retrieve the inventory name from the query parameter
        const { inventoryName } = req.query;

        const collection = mongoose.connection.collection(inventoryName);

        if (!collection) {
            return res.status(404).json({ error: 'Inventory not found.' });
        }

        const records = await collection.find({}).toArray();
        res.status(200).json(records);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Route for adding an item to the inventory
app.post('/addItem', async (req, res) => {
    try {
        const { itemName, itemPrice, itemQuantity, itemSupplier , inventoryName} = req.query;

        // Use the database to find the collection and add the item
        const db_ = mongoose.connection.db;
        const collection = db_.collection(inventoryName);

        const newItem = {
            name: itemName,
            price: itemPrice,
            quantity: itemQuantity,
            supplier: itemSupplier
        };

        // Insert the new item into the collection
        await collection.insertOne({ items: [newItem] });

        res.status(200).json({ message: 'Item added successfully.' });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Route for removing an item from the inventory
app.post('/removeItem', async (req, res) => {
       try {
               const itemName = req.query.name;
               const inventoryName = req.query.inventoryName;

               const inventory = mongoose.connection.collection(inventoryName);
               await inventory.deleteOne({ 'items.name': itemName });

               res.status(200).json({ message: 'Item removed successfully.' });
           } catch (error) {
               console.error(error);
               res.status(500).json({ error: 'Internal server error' });
           }
    });

//Route for adding a csv file to the inventory
app.post('/uploadEndpoint', upload.single('file'), (req, res) => {
    try {
        // Ensure a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        const fileBuffer = req.file.buffer;

        const fileContent = fileBuffer.toString('utf-8');

        // Process the CSV file content and convert it into a 2D array
        const csvData = [];
        const rows = fileContent.split('\n');
        rows.forEach(row => {
            const columns = row.split(',');
            csvData.push(columns);
        });

        res.json({ success: true, data: csvData });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
