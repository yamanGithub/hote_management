const getConnection = require('../connection');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
function authUser(user, password, callback){
    let sql_stmt = 'select position,name,email from employee where email = @User and password = @Password;';
    getConnection().then(function(connection) {
        request = new Request(
            sql_stmt,
            function(err, Nrow, rows) {
            if (err) {
                connection.close();
                callback({status:false, msg: 'Unable to process the reuest at the moment. Please try again later.' ,data: err});
            }
            if(Nrow === 0){
                connection.close();
                callback({status:false, msg: 'Invalid username or password.' ,data: []});
            }
            var rowarray = [];
            rows.forEach(function(columns){
                var rowdata = new Object();
                columns.forEach(function(column) {
                    rowdata[column.metadata.colName] = column.value;
                });
                rowarray.push(rowdata);
            });
            connection.close();
            callback({status:true, msg: 'Login Successfull' ,data: rowarray});
        });
        request.addParameter('User', TYPES.NVarChar, user);
        request.addParameter('Password', TYPES.NVarChar, password);
        connection.execSql(request);
    });
}
module.exports = authUser;