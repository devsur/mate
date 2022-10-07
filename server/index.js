const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const uri = `mongodb+srv://admin:mypassword@cluster0.epmz51z.mongodb.net/cluster0?retryWrites=true&w=majority`;
const PORT = 8000;

app.use(cors());
app.use(express.json()); // access req, res props as json i.e req.body

app.get('/', (req, res) => {
    res.json('hello world');
});

app.post('/signup', async (req, res) => {
    const client = new MongoClient(uri);
    const { email, password } = req.body;
    // gen user uuid
    const generatedUserId = uuidv4();
    // hash plaintext password from client
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');
        const existingUser = await users.findOne({email});
        if (existingUser) return res.status(409).send('User already exists. Please log in.');
        const sanitizedEmail = email.toLowerCase();
        const data = {
            user_id: generatedUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        };
        // write data to app-data db
        const insertedUser = await users.insertOne(data);
        // generate jsonwebtoken to create 24H session
        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24
        });
        res.status(201).json({
            token,
            userId: generatedUserId,
            email: sanitizedEmail
        });
    } catch (err) {
        console.log(err);
    }
});

app.get('/users', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');
        const resUsers = await users.find().toArray();
        res.send(resUsers);
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));