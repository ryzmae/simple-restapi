import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import chalk from 'chalk';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
dotenv.config();
const app = express();
app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());
const server = http.createServer(app);
const port = process.env.PORT || 6000;
server.listen(port, () => {
    console.log(chalk.blue(`Server is listening on port ${port}`));
});
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/express-typescript';
mongoose.connect(MONGO_URI);
mongoose.connection.on('connected', () => {
    console.log(chalk.green('Connected to MongoDB'));
});
mongoose.connection.on('error', (err) => {
    console.log(chalk.red(`Error connecting to MongoDB: ${err}`));
});
mongoose.connection.on('disconnected', () => {
    console.log(chalk.yellow('Disconnected from MongoDB'));
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/add', (req, res) => {
    const name = req.query.name;
    res.send(`Hello ${name}!`);
    mongoose.connection.db.collection('users').insertOne({ name });
});
app.get('/users', async (req, res) => {
    const users = await mongoose.connection.db.collection('users').find().toArray();
    res.send(users);
});
app.post('/users', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Name is required');
    }
    else if (await mongoose.connection.db.collection('users').findOne({ name })) {
        return res.status(400).send('User already exists');
    }
    await mongoose.connection.db.collection('users').insertOne({ name });
    res.send('User added!');
});
app.delete('/users', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Name is required');
    }
    await mongoose.connection.db.collection('users').deleteOne({ name });
    res.send('User deleted!');
});
app.get('/users/:name', async (req, res) => {
    const { name } = req.params;
    const user = await mongoose.connection.db.collection('users').findOne({ name });
    res.send(user);
});
app.put('/users/:name', async (req, res) => {
    const { name } = req.params;
    const { newName } = req.body;
    if (!newName) {
        return res.status(400).send('New name is required');
    }
    else if (await mongoose.connection.db.collection('users').findOne({ name: newName })) {
        return res.status(400).send('User already exists');
    }
    await mongoose.connection.db.collection('users').updateOne({ name }, { $set: { name: newName } });
    res.send('User updated!');
});
app.get("/todos", async (req, res) => {
    const todos = await mongoose.connection.db.collection("todos").find().toArray();
    res.send(todos);
});
app.post("/todos", async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).send("Title is required");
    }
    else if (!description) {
        return res.status(400).send("Description is required");
    }
    else if (await mongoose.connection.db.collection("todos").findOne({ title })) {
        return res.status(400).send("Todo already exists");
    }
    await mongoose.connection.db.collection("todos").insertOne({ title, description });
    res.send("Todo added!");
});
app.delete("/todos", async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).send("Title is required");
    }
    else {
        await mongoose.connection.db.collection("todos").deleteOne({ title });
        res.send("Todo deleted!");
    }
});
app.get("/todos/:title", async (req, res) => {
    const { title } = req.params;
    if (!title) {
        return res.status(400).send("Title is required");
    }
    res.send(await mongoose.connection.db.collection("todos").findOne({ title }));
});
app.get("/todos/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send("Id is required");
    }
    await mongoose.connection.db.collection("todos").findOne({ id });
});
//# sourceMappingURL=index.mjs.map