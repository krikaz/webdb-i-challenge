const express = require('express');
const db = require('./data/dbConfig.js');
const server = express();

function getAllAccounts() {
	return db('accounts');
}

function createNewAccount({ name, budget }) {
	return db('accounts').insert({ name, budget });
}

server.use(express.json());

server.get('/accounts', async (req, res) => {
	const result = await getAllAccounts();
	res.json(result);
});

server.post('/accounts', async (req, res) => {
	const arrayIds = await createNewAccount(req.body);
	res.json(arrayIds[0]);
});

module.exports = server;
