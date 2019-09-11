const mongoose = require('mongoose');
const validate = require('validator');
const Crypto = require('simple-crypto-js').default;

const crypto = new Crypto('out-of-the-box');

const AccountSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cardHolderName: {
        type: String,
        trim: true
    },
    accountNumber: { //This is the bank card number found on the credit card
        type: String,
        required: true,
        trim: true,
        minlength: 13,
        unique: true
    },
    cardExpiryDate: {
        type: String,
        required: true,
        trim: true
    },
    CVV: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    }, 
    createdAt: {
        type: Date,
        default: new Date(Date.now() + 60 * 60 * 1000)
    }
}, {
    timestamps: true
});

// Hash all sensitive data
AccountSchema.pre('save', function(next) {
    let account = this;
    // account.accountNumber = crypto.encrypt(account.accountNumber);
    account.cardExpiryDate = crypto.encrypt(account.cardExpiryDate);
    account.CVV = crypto.encrypt(account.CVV);
    console.log(account.cardHolderName);
    if(account.cardHolderName != undefined) {
        account.cardHolderName = crypto.encrypt(account.cardHolderName);
    }

    console.log(account);
    return next();
});

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;