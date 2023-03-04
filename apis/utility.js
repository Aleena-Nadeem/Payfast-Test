//library imports
const axios = require('axios');
const Boom = require('boom');

let APIKEY = "PIMLRTW23BLTYO0T"
const amountConversion = () => {
return new Promise(async (resolve, reject) => {
    try {
        const apiUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=PKR&to_currency=USD&apikey=${APIKEY}`;
        const convertCurrency = {
            method: 'GET',
            url: apiUrl,
            headers: {
              'Content-Type': 'application/json'
                     }
          
                  }
        const response = await axios(convertCurrency);
           
         resolve(response.data)
                }
        
    catch (error) {
        console.log(error);
        reject(error);
                }
            });
        
        };
        
        
        
        module.exports = {
            amountConversion
        }