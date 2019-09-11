const VisaAPIClient = require('../libs/visaAPIClient.lib');
const Account = require('../models/account.model');
const Crypto = require('simple-crypto-js').default;

const crypto = new Crypto('out-of-the-box');

const baseUri = 'visadirect/';
const resourcePath = {
    pull_transaction: 'fundstransfer/v1/pullfundstransactions',
    push_transaction: 'fundstransfer/v1/pushfundstransactions'
};
const visaAPIClient = new VisaAPIClient();
const strDate = new Date(Date.now() + 60 * 60 * 1000).toISOString().replace(/\..+/, '');

// Create a virtual card
exports.createVirtualCard = (req, res) => {
    // Get account information from request
    let account = new Account(req.body);
    account.userID = req.user._id;

    Account.init().then(async () => {
        try {
            await account.save();
            account.accountNumber = crypto.encrypt(account.accountNumber);
            res.status(201).send({"error": false, "result": 'Created Successfully'});
        } catch (error) {
            console.log(account, error);
            res.status(400).send({"error": true, "result": error.message});
        }
    }).catch(error => {
        console.error(error);
        res.status(400).send({"error": true, "result": error.message});
    });

};

exports.getCards = async (req, res) => {
    try {
        const cards = await Account.find({userID: req.user._id});
        cards.forEach(card => {
            card.accountNumber = crypto.encrypt(card.accountNumber);
        });
        // console.log(cards);
        res.status(201).send({"error": false, "result": cards});
    } catch (error) {
        console.log("Errors", error);
        res.status(401).send({error: true, code: 13589, results: 'Can\'t get Card Details',
         message: error.message});
    }
}

exports.deleteCard = async (req, res) => {
    try {
        const cardNumber = req.body.cardNumber;
        let deleteResult = await Account.findOneAndDelete({accountNumber: cardNumber});
        console.log(deleteResult);
        res.status(201).send({"error": false, "result": deleteResult});
    } catch (error) {
        console.log("Errors", error);
        res.status(401).send({error: true, code: 13589, results: 'Can\'t delete Card',
         message: error.message});
    }
}

// Pull funds in a transaction process
exports.pullFunds = (req, res) => {
    // Get account information from request
    let account = new Account(req.body);
    account.userID = req.user._id;
    let pullFundsRequest = JSON.stringify({
        "acquirerCountryCode": "840",
        "acquiringBin": "408999",
        "amount": "200",
        "businessApplicationId": "AA",
        "cardAcceptor": {
          "address": {
            "country": "USA",
            "county": "San Mateo",
            "state": "CA",
            "zipCode": "94404"
          },
          "idCode": "ABCD1234ABCD123",
          "name": "Visa Inc. USA-Foster City",
          "terminalId": "ABCD1234"
        },
        "cavv": "0700100038238906000013405823891061668252",
        "foreignExchangeFeeTransaction": "11.99",
        "localTransactionDateTime": strDate,
        "retrievalReferenceNumber": "330000550000",
        "senderCardExpiryDate": "2020-03",
        "senderCurrencyCode": "CAD",
        "senderPrimaryAccountNumber": "4957030005123354",
        "surcharge": "11.99",
        "systemsTraceAuditNumber": "451001",
          "merchantCategoryCode": 6012
      });

    // pull funds request
    try {
        visaAPIClient.doMutualAuthRequest(baseUri + resourcePath.pull_transaction, pullFundsRequest, req.method, {},
        function(err, response) {
            if(!err) {
                console.log("Success: ", JSON.parse(response.body));
            } else {
                console.error("Failed: ", err);
                throw new Error(err);
            }
            res.status(201).send({statusCode: response.statusCode, body: JSON.parse(response.body)});
        });
    } catch (error) {
        res.status(400).send({error});
        console.log(error);
    }
};

exports.pushFunds = (req, res) => {
    // Get account information from request
    let account = new Account(req.body);
    account.userID = req.user._id;
    let pushFundsRequest = JSON.stringify({
        "acquirerCountryCode": "840",
        "acquiringBin": "408999",
        "amount": "124.05",
        "businessApplicationId": "AA",
        "cardAcceptor": {
                "address": {
                "country": "USA",
                "county": "San Mateo",
                "state": "CA",
                "zipCode": "94404"
            },
            "idCode": "CA-IDCode-77765",
            "name": "Visa Inc. USA-Foster City",
            "terminalId": "TID-9999"
        },
        "localTransactionDateTime": strDate,
        "merchantCategoryCode": "6012",
        "pointOfServiceData": {
            "motoECIIndicator": "0",
            "panEntryMode": "90",
            "posConditionCode": "00"
        },
        "recipientName": "rohan",
        "recipientPrimaryAccountNumber": "4957030420210496",
        "retrievalReferenceNumber": "412770451018",
        "senderAccountNumber": "4653459515756154",
        "senderAddress": "901 Metro Center Blvd",
        "senderCity": "Foster City",
        "senderCountryCode": "124",
        "senderName": "Mohammed Qasim",
        "senderReference": "",
        "senderStateCode": "CA",
        "sourceOfFundsCode": "05",
        "systemsTraceAuditNumber": "451018",
        "transactionCurrencyCode": "USD",
        "transactionIdentifier": "381228649430015",
        "settlementServiceIndicator": "9"
    });

    // push funds request
    try {
        visaAPIClient.doMutualAuthRequest(baseUri + resourcePath.push_transaction, pushFundsRequest, req.method, {},
        function(err, response) {
            if(!err) {
                console.log("Success: ", JSON.parse(response.body));
            } else {
                console.error("Failed: ", err);
                throw new Error(err);
            }
            res.status(201).send({statusCode: response.statusCode, body: JSON.parse(response.body)});
        });
    } catch (error) {
        res.status(400).send({error});
        console.log(error);
    }
}

exports.getPushFund = (req, res) => {
    // push funds request
    try {
        console.log("Method: ", req.method);
        visaAPIClient.doMutualAuthRequest(baseUri + resourcePath.push_transaction + '/200985903051684', JSON.stringify({}), req.method, {},
        function(err, response) {
            if(!err) {
                console.log("Success: ", JSON.parse(response.body));
            } else {
                console.error("Failed: ", err);
                throw new Error(err);
            }
            res.status(201).send({statusCode: response.statusCode, body: JSON.parse(response.body)});
        });
    } catch (error) {
        res.status(400).send({error});
        console.log(error);
    }
}

exports.validateAccount = (req, res) => {
    let visaAPIClient = new VisaAPIClient();
    let accountDetails = JSON.stringify({
        "cardCvv2Value": "672",
        "cardExpiryDate": "2020-06",
        "primaryAccountNumber": "4895142232120006",
        "addressVerificationResults": {
            "street": "XYZ St",
            "postalCode": "12345"
        }
    });
    let baseUri = 'pav/';
    let resourcePath = 'v1/cardvalidation';
    try {
        visaAPIClient.doMutualAuthRequest(baseUri + resourcePath, accountDetails, req.method, {},
		function(err, response) {
			if(!err) {
				console.log("Success: ", JSON.parse(response.body));
			} else {
				console.error("Failed: ", err);
            }
            res.status(201).send({statusCode: response.statusCode, body: JSON.parse(response.body)});
		});
    } catch (error) {
        res.status(400).send({error});
        console.log(error);
    }
};