'use strict';

//Library imports
const { params, payload } = require('@hapi/hapi/lib/validation');
//Custom imports

const Model = require('../model.js');

module.exports.saveDetails = (req, res) => {
	return new Promise(async (resolve, reject) => {
		try {
                let paymentDetails = await Model.saveToDB(req.payload)
				resolve(paymentDetails)
				
		}
		catch (error) {
			console.log("error");
            return reject(error);
		}
	});

};

module.exports.showTransactions = (req, res) => {
	return new Promise(async (resolve, reject) => {
		try {
			let response_redirect = true;
			//let query = req.query ? JSON.parse(JSON.stringify(req.query)) : req.query;
			let query = JSON.stringify(req.query);
			
			let inquireDetails = await Model.getTransactions(req.query)
			resolve(inquireDetails);
		}
		catch (error) {
			console.log(error);
            return reject(error);

		}
	});

};


module.exports.completeTransactions = (req, res) => {
	return new Promise(async (resolve, reject) => {
		try {
			let query = JSON.stringify(req.query);
			
			let inquireDetails = await Model.getAll()
			resolve(inquireDetails);
		}
		catch (error) {
			console.log(error);
            return reject(error);

		}
	});

};

