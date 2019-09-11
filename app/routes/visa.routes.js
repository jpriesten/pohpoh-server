module.exports = (app) => {
    const visa = require('../controllers/visa.controller');
    const authenticate = require('../middlewares/authenticator.middleware');

    // Validate a VISA account
    app.post('/transactions/validate-account', authenticate, visa.validateAccount);

    // Perform PullFundsTransactions Post operation
    app.post('/transactions/pull-funds', authenticate, visa.pullFunds);

    // Perform PushFundsTransactions Post operation
    app.post('/transactions/push-funds', authenticate, visa.pushFunds);

    // Perform PushFundsTransactions Get operation
    app.get('/transactions/get-push-fund', authenticate, visa.getPushFund);

    // Create a new virtual card
    app.post('/cards/new', authenticate, visa.createVirtualCard);

    // Get cards by user
    app.get('/cards', authenticate, visa.getCards);

    // Delete a card
    app.delete('/card', authenticate, visa.deleteCard);
}