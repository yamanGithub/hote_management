const getConnection = require('../connection');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
function getDashBoardData(callback){
    let sql_stmt = "SELECT 'Occupied Rooms' as 'label', COUNT(*) count FROM rooms where available='N'UNION SELECT  'CheckedIn Guests',  COUNT(*) FROM booking where checkout_time='' UNION SELECT 'Available Rooms', COUNT(*) FROM rooms  where available='Y' UNION SELECT 'Total Guest', COUNT(*) FROM booking UNION SELECT 'Total Booking', COUNT(*) FROM booking UNION SELECT 'Total Staff', COUNT(*) FROM employee;";
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
                callback({status:false, msg: 'No data available.' ,data: []});
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
            callback({status:true, msg: 'Successfull' ,data: rowarray});
        });
        connection.execSql(request);
    });
}
module.exports = getDashBoardData;