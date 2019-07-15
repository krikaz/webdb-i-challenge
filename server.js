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

// ENDPOINTS

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

server.post('/accounts', validateAccount, async (req, res) => {
	try {
		const arrayIds = await createNewAccount(req.body);
		res.status(201).json(arrayIds[0]);
	} catch (error) {
		res.status(500).json({
			error: 'There was an error while saving the account to the database',
		});
	}
});

server.put('/accounts/:id', validateAccount, async (req, res) => {
	const { name, budget } = req.body;
	const result = await updateAccountById(req.params.id, { name, budget });
	res.json(result);
});

// MIDDLEWARE

async function validateAccount(req, res, next) {
	const { name, budget } = req.body;
	if (typeof name === 'string') {
		if (typeof budget === 'number') {
			next();
		} else {
			res.status(400).json({ message: 'budget is not a number' });
		}
	} else {
		res.status(400).json({ message: 'name is not a string' });
	}
}

module.exports = server;
