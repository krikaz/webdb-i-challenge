const express = require('express');
const db = require('./data/dbConfig.js');
const server = express();

function getAllAccounts() {
	return db('accounts');
}

function getAccountById(id) {
	return db('accounts').where({ id });
}

function deleteAccountById(id) {
	return db('accounts')
		.where({ id })
		.del();
}

function createNewAccount({ name, budget }) {
	return db('accounts').insert({ name, budget });
}

function updateAccountById(id, { name, budget }) {
	return db('accounts')
		.where({ id })
		.update({ name, budget });
}

server.use(express.json());

server.get('/accounts', async (req, res) => {
	const result = await getAllAccounts();
	res.json(result);
});

server.get('/accounts/:id', async (req, res) => {
	const result = await getAccountById(req.params.id);
	res.json(result);
});

server.delete('/accounts/:id', async (req, res) => {
	const result = await deleteAccountById(req.params.id);
	res.json(result);
});

server.post('/accounts', async (req, res) => {
	const arrayIds = await createNewAccount(req.body);
	res.json(arrayIds[0]);
});

server.put('/accounts/:id', async (req, res) => {
	const { name, budget } = req.body;
	const result = await updateAccountById(req.params.id, { name, budget });
	res.json(result);
});

module.exports = server;
