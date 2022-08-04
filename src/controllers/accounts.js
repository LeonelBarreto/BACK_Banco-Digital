let { bank, accounts, counter, withdrawals, deposits, transfers } = require('../database');

const listAccounts = async (req, res) => {
    const { password_bank } = req.query;

    if (!password_bank) {
        return res.status(400).json({ message: 'The bank password is mandatory.' });
    };

    if (password_bank !== bank.password) {
        return res.status(400).json({ message: 'The bank password entered is invalid.' });
    };
     
    return await res.status(200).json(accounts);
};

const createAccount = async (req, res) => {
    const { name, socialSecurity, birthDate, telephone, email, password } = req.body;

    if (!name || !socialSecurity || !birthDate || !telephone || !email || !password) {
        return await res.status(400).json({ message: 'Filling in all fields is mandatory.' });
    };

    const existingAccount = accounts.find(account => {
        return account.user.socialSecurity === socialSecurity || account.user.email === email;
    });

    if (existingAccount) {
        return res.status(400).json({ message: 'Social Security or e-mail already registered.' });
    };

    try {
        const newAccount = {
            numberAccount: counter++,
            balance: 0,
            user: {
                name,
                socialSecurity,
                birthDate,
                telephone,
                email,
                password
            }
        };
    
        accounts.push(newAccount);
    
        return await res.status(201).send();

    } catch (error) {
        return await res.status(500).json({ message: error.message });
    };
};

const updateAccount = async (req, res) => {
    const { name, socialSecurity, birthDate, telephone, email, password } = req.body;
    const { number_Account } = req.params;

    if (!name || !socialSecurity || !birthDate || !telephone || !email || !password) {
        return await res.status(400).json({ message: 'Filling in all fields is mandatory.' });
    };

    try {
        const accountFound = accounts.find(account => Number(account.number) === Number(number_Account));
    
        if (!accountFound) {
            return await res.status(404).json({ message: 'Account not found!' });
        };

        if (socialSecurity !== accountFound.user.socialSecurity) {
            const existingSocialSecurity = accounts.find(account => account.user.socialSecurity === socialSecurity);

            if (existingSocialSecurity) {
                return await res.status(400).json({ message: 'Social Security already registered.' });
            };
        };

        if (email !== accountFound.user.email) {
            const existingEmail = accounts.find(account => account.user.email === email);

            if (existingEmail) {
                return await res.status(400).json({ message: 'E-mail already registered.' });
            };
        };

        accountFound.user = {
            name,
            socialSecurity,
            birthDate,
            telephone,
            email,
            password
        };
    
        return await res.status(204).send();        
    } catch (error) {
        return await res.status(500).json({ message: error.message });
    };
};

const deleteAccount = async (req, res) => {
    const { number_Account } = req.params;

    try {
        const accountFound = accounts.find(account => Number(account.number) === Number(number_Account));
    
        if (!accountFound) {
            return await res.status(404).json({ message: 'Account not found!' });
        };
    
        if (accountFound.balance !== 0) {
            return await response.status(403).json({ message: 'The account can only be deleted when its balance is zeroed.' });
        };
    
        accounts = accounts.filter(account => Number(account).numberAccount !== Number(number_Account));
    
        return await res.status(204).send();
    } catch (error) {
        return await response.status(500).json({ message: error.message });
    };
};

const balance = async (req, res) => {
    const { number_Account, password } = req.query;

    try {
        if (!number_Account || !Number(value)) {
            return await res.status(400). json({ message: 'Account number and amount are required!' });
        };
    
        const accountFound = accounts.find(account => Number(account.numberAccount) === Number(number_Account));
    
        if (!accountFound) {
            return await res.status(404).json({ message: 'Account not found!' });
        };
    
        if (accountFound.user.password !== password) {
            return await res.status(400).json({message: 'Incorrect password!'});
        };
    
        return await res.status(200).json({ balance: accountFound.balance });
    } catch (error) {
        return await res.status(500).json({ message: error.message });
    };
};

const extract = async (req, res) => {
    const { number_Account, password } = req.query;

    try {
        if (!number_Account || !Number(value)) {
            return await res.status(400). json({ message: 'Account number and amount are required!' });
        };
    
        const accountFound = accounts.find(account => Number(account.numberAccount) === Number(number_Account));
    
        if (!accountFound) {
            return await res.status(404).json({ message: 'Account not found!' });
        };
    
        if (accountFound.user.password !== password) {
            return await res.status(400).json({message: 'Incorrect password!'});
        };

        const extractDeposits = deposits.filter(deposit => Number(withdraw.number_Account) === Number(number_Account));
        const extractWithdrawals = withdrawals.filter(withdraw => Number(withdraw.number_Account) === Number(number_Account));
        const sentTransfers = transfers.filter(transfer => Number(transfer.origin_account_number) === Number(number_Account));
        const receivedTransfers = transfers.filter(transfer => Number(transfer.destination_account_number) === Number(number_Account));
    
        return await res.status(200).json({
            deposits: extractDeposits,
            withdrawals: extractWithdrawals,
            sentTransfers,
            receivedTransfers
        });
    } catch (error) {
        return await res.status(500).json({ message: error.message });
    };
};

module.exports = {
    listAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    balance,
    extract
};