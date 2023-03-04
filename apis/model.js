
// Library imports
const Boom = require('boom');

// Custom imports
const sqlite3 = require('sqlite3').verbose();
const { amountConversion } = require('./utility')



const db = new sqlite3.Database('payfast.db', err => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Connected to the payfast database.');
      db.run(`CREATE TABLE IF NOT EXISTS payfast (
        transaction_id TEXT PRIMARY KEY,
        dateTime TEXT NOT NULL,
        Bank_Account_Number NOT NULL,
        Bank_Name NOT NULL,
        CNIC_Number NOT NULL,
        Amount NOT NULL,
        Email_Address NOT NULL,
        Mobile_Number NOT NULL
      )`, err => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('payfast table created or already exists.');
        }
      });
    }
  });
  

const saveToDB = async (columns) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Insert the data into the database
      const transaction_id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      const dateTime = new Date().toISOString();

      const { Bank_Account_Number, Bank_Name, CNIC_Number, Amount, Email_Address, Mobile_Number } = columns;
      const sql = `INSERT INTO payfast(transaction_id, dateTime, Bank_Account_Number, Bank_Name, CNIC_Number, Amount, Email_Address, Mobile_Number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      db.run(sql, [transaction_id, dateTime, Bank_Account_Number, Bank_Name, CNIC_Number, Amount, Email_Address, Mobile_Number], function (err) {
        if (err) {
          console.error(err.message);
          reject(new Error('Failed to save transaction'));
        } else {
          // Highlighted new row starts here
          const newTransaction = {
            transaction_id,
            dateTime,
            Bank_Account_Number,
            Bank_Name,
            CNIC_Number,
            Amount,
            Email_Address,
            Mobile_Number,
          };
          // Call getAll function after resolving makeform
          getAll().then(result => {
            console.log(result);
            const rows = result.map(row => {
              return `<tr>
                        <td>${row.transaction_id}</td>
                        <td>${row.dateTime}</td>
                        <td>${row.Bank_Account_Number}</td>
                        <td>${row.Bank_Name}</td>
                        <td>${row.CNIC_Number}</td>
                        <td>${row.Amount}</td>
                        <td>${row.Email_Address}</td>
                        <td>${row.Mobile_Number}</td>
                        </tr>`;
            });
            const table = `<table>
                            <thead>
                              <tr>
                                <th>Transaction ID</th>
                                <th>Date Time</th>
                                <th>Bank Account Number</th>
                                <th>Bank Name</th>
                                <th>CNIC Number</th>
                                <th>Amount</th>
                                <th>Email Address</th>
                                <th>Mobile Number</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${rows.join('')}
                            </tbody>
                          </table>`;
            const makeform = `<html>
                                <head>
                                  <title>Success</title>
                                  <style>
                                    body {
                                      background-color: #f2f2f2;
                                      font-family: Arial, sans-serif;
                                    }
                                    h1 {
                                      color: #0d6efd;
                                      text-align: center;
                                      margin-top: 50px;
                                    }
                                    p {
                                      color: #0d6efd;
                                      font-size: 18px;
                                      text-align: center;
                                      margin-top: 20px;
                                    }
                                    table {
                                      border-collapse: collapse;
                                      width: 100%;
                                    }
                                    th, td {
                                      text-align: left;
                                      padding: 8px;
                                    }
                                    th {
                                      background-color: #0d6efd;
                                      color: white;
                                    }
                                    tr:nth-child(even) {
                                      background-color: #f2f2f2;
                                    }
                                  </style>
                                </head>
                                <body>
                                  <h1>Transaction saved successfully</h1>
                                  <p>Transaction with ID ${transaction_id} and mobile number ${Mobile_Number} saved successfully</p>
                                  ${table}
                                </body>
                              </html>`;
            resolve(makeform);
          }).catch(error => {
            reject(Boom.badImplementation(error, error));
          });
        }
      });
    } catch (error) {
      reject(Boom.badImplementation(error, error));
    }
  });
};






const getTransactions = async (query) => {
    return new Promise(async (resolve, reject) => {

        try {
            const { transaction_id, mobile_no } = query;
            
            const sql = `SELECT * FROM payfast WHERE transaction_id = ? AND Mobile_Number = ?`;
            const params = [query.transaction_id, query.mobile_no]

            db.get(sql, params, async (err, row) => {
                if (err) {
                  console.error(err.message);
                  reject(new Error('Failed to retrieve transaction'));
                } else if (row) {
                    const convert = await amountConversion()
                    const exchangeRate  = convert['Realtime Currency Exchange Rate']['5. Exchange Rate'];
                    const usdAmount = parseFloat(row.Amount) * parseFloat(exchangeRate);
                    row.USDAmount = usdAmount.toFixed(2);

                    const makeform = `
                    <html>
                      <head>
                        <title>Transactions</title>
                        <style>
                          body {
                            background-color: #f2f2f2;
                            font-family: Arial, sans-serif;
                          }
                          h1 {
                            color: #0d6efd;
                            text-align: center;
                            margin-top: 50px;
                          }
                          table {
                            margin: 0 auto;
                            border-collapse: collapse;
                          }
                          th, td {
                            padding: 10px;
                            text-align: left;
                            border: 1px solid black;
                          }
                          th {
                            background-color: #0d6efd;
                            color: white;
                          }
                          td.USD {
                            font-weight: bold;
                          }
                        </style>
                      </head>
                      <body>
                        <h1>Transactions</h1>
                        <table>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Date/Time</th>
                              <th>Bank Account Number</th>
                              <th>Bank Name</th>
                              <th>CNIC Number</th>
                              <th>Amount</th>
                              <th>Email Address</th>
                              <th>Mobile Number</th>
                              <th>USD Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>${row.transaction_id}</td>
                              <td>${row.dateTime}</td>
                              <td>${row.Bank_Account_Number}</td>
                              <td>${row.Bank_Name}</td>
                              <td>${row.CNIC_Number}</td>
                              <td>${row.Amount}</td>
                              <td>${row.Email_Address}</td>
                              <td>${row.Mobile_Number}</td>
                              <td class="USD">${row.USDAmount}</td>
                            </tr>
                          </tbody>
                        </table>
                      </body>
                    </html>
                  `;
                
                  resolve(makeform);
                } else {
                  reject(new Error('Transaction not found'));
                }
                });


        } catch (error) {
            reject(Boom.badImplementation(error, error));
        }
    });
};

const getAll = async () => {
  return new Promise(async (resolve, reject) => {

      try {

          const sql = `SELECT * FROM payfast`;
          
          db.all(sql, async (err, row) => {
              if (err) {
                console.error(err.message);
                reject(new Error('Failed to retrieve transaction'));
              } else if (row) {
                resolve(row);
              } else {
                reject(new Error('Transaction not found'));
              }
              });

      } catch (error) {
          reject(Boom.badImplementation(error, error));
      }
  });
};

module.exports = {
    saveToDB,
    getTransactions,
    getAll
};


