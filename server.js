'use strict';

//Library imports
const Hapi = require('@hapi/hapi');
const Boom = require('boom');

//Custom imports
const routes = require('./src/routes/routes.js');
//const { connectDB } = require('./src/config/constants.js');   -- required for connectingdb

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost'
  });


  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
