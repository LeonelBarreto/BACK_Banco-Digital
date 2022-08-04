let { accounts, withdrawals, deposits, transfers } = require('../database');
const { format } = require('date-fns');

let newDate = new Date();
let date = format(newDate, 'yyyy-MM-dd HH:mm:ss');


const deposit = async (req, res) => {
    const { number_Account, value } = req.body;

    try {
        if (!number_Account || !Number(value)) {
            return await res.status(400). json({ message: 'Account number and amount are required!' });
        };
        
        const accountFound = accounts.find(account => Number(account.numberAccount) === Number(number_Account));
    
        if (!accountFound) {
            return await res.status(404).json({ message: 'Account not found!' });
        };
    
        if (!Number(value) <= 0) {
            return await res.status(400).json({ message: 'Do not allow deposits with negative or zero values!' });
        };    
        
        accountFound.balance += Number(value);
    
        const depositMade = {
            date,
            number_Account,
            value
        };
    
        deposits.push(depositMade);
    
        return await res.status(201).send();
    } catch (error) {
        return await res.status(500).json({ message: error.message });
    };    
};

const withdraw = async (req, res) => {
    const { number_Account, value, password } = req.body;

    try {
        if (!number_Account || !Number(value) || !password) {
            return await res.status(400). json({ message: 'Account number, amount and password are required!' });
        };
        
        const accountFound = accounts.find(account => Number(account.numberAccount) === Number(number_Account));
    
        if (!accountFound) {
            return await res.status(404).json({ message: 'Account not found!' });
        };

        if (accountFound.user.password !== password) {
            return await res.status(400).json({ message: 'Invalid password.' });
        };
    
        if (Number(accountFound.balance) < Number(value)) {
            return await res.status(403).json({ message: 'Insufficient funds.' });
        };    
        
        accountFound.balance -= Number(value);
    
        const depositMade = {
            date,
            number_Account,
            value
        };
    
        withdrawals.push(depositMade);
    
        return await res.status(201).send();
    } catch (error) {
        return await res.status(500).json({ message: error.message });
    };
};

const transfer = async (req, res) => {
    const { origin_account_number, destination_account_number, value, password } = req.body;

    try {
        if (!origin_account_number || !destination_account_number || !Number(value) || !password) {
            return await res.status(400).json({ message: "The account number, value and password must be informed!" });
        };

        const originAccountFound = accounts.find(account => Number(account.numberAccount) === Number(origin_account_number));
    
        if (!originAccountFound) {
            return await res.status(404).json({ message: 'Origin account not found!' });
        };

        const destinationAccountFound = accounts.find(account => Number(account.numberAccount) === Number(destination_account_number));
    
        if (!destinationAccountFound) {
            return await res.status(404).json({ message: 'Destination account not found!' });
        };

        if (originAccountFound.user.password !== password) {
            return await res.status(401).json({ message: 'Incorrect password!'});
        };

        if (Number(originAccountFound.balance) < Number(value)) {
            return await res.status(403).json({ message: 'Insufficient funds.' });
        };
    
        originAccountFound.balance -= Number(value);
        destinationAccountFound.balance += Number(value);
    
        const transferMade = {
            date,
            origin_account_number,
            destination_account_number,
            value
        };
    
        transfers.push(transferMade);
    
        return await response.status(201).send();
    } catch (error) {
        return await response.status(500).json({ message: error.message });
    };
};

module.exports = {
    deposit,
    withdraw,
    transfer
};