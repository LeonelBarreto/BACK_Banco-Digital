const express = require('express');
const { listAccounts, createAccount, updateAccount, deleteAccount, balance, extract } = require('./controllers/accounts');
const { deposit, withdraw, transfer } = require('./controllers/transactions');

const routes = express();

routes.get('/accounts', listAccounts);
routes.post('/accounts', createAccount);
routes.put('/accounts/:account_Number/user', updateAccount);
routes.delete('/accounts/:account_Number', deleteAccount);
routes.get('/account/balance', balance);
routes.get('/account/extract', extract);

routes.post('/transaction/deposit', deposit);
routes.post('/transaction/withdraw', withdraw);
routes.post('/transaction/transfer', transfer);

module.exports = routes;