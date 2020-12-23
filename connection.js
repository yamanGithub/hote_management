var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// Create connection to database
var config = {
  server: 'localhost',
  authentication: {
      type: 'default',
      options: {
          userName: 'sa', // update me
          password: 'Asam@9852' // update me
      },
  },
  options: {
      database: 'hotel_management',
      encrypt: true,
      port: 1401,
      rowCollectionOnRequestCompletion: true
  }
};
function getConnection () {
  return new Promise((resolve, reject) => {
    var connection = new Connection(config);

    connection.on('connect', function(err) {
      if (err) return reject(err);
      resolve(connection);
    });
  });
}
module.exports = getConnection;
// Attempt to connect and execute queries if connection goes through

