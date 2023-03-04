'use strict';

// Library imports
const Joi = require('joi');
const Boom = require('boom');

// Custom imports
const Payfast = require('../apis/Payfast/controller.js');

const routes = [];

const transactionDetails = {
	method: 'POST',
	path: '/submit-details',
	config: {
		validate: {
			headers: Joi.object({
				'authorization': Joi.string().required().description(`Payfast123`)
			}).unknown(),
			payload: {
                Bank_Account_Number: Joi.string().min(8).max(16).required(),
                Bank_Name: Joi.string().required().valid('MCB', 'UBL', 'ASKARI').description('will be provided from dropdown menu'),
                CNIC_Number: Joi.string().pattern(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/).required(),
                Amount: Joi.string().required(),
                Email_Address: Joi.string().required(),
                Mobile_Number: Joi.string().required()
			}
		}
	},
	handler: Notification.controller
};
routes.push(transactionDetails);



const transactionReport = {
	method: 'GET',
	path: '/transaction-report',
	config: {
		validate: {
            query: {
				Transaction_id: Joi.array().require(),
				mobile_no: Joi.array().required()
		}
	},
	handler: DeliveryReport.controller
}
};
routes.push(transactionReport);


const forbidden = {
	method: 'GET',
	path: '/',
	config: {
	},
	handler: (request, response) => {
		return (Boom.forbidden('try again some time!'));
	}
};
routes.push(forbidden);

module.exports = routes;



