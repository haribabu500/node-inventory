var express = require('express');
var mysql=require('mysql');
var adminController=require('./controllers/adminController');
var salesController=require('./controllers/salesController');

var app=express();
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'inventory'
});
connection.connect();

// set up template engiene
app.set('view engine','ejs');

//sattic files
app.use(express.static('./public'));

//fire controllers
adminController(app,connection);
salesController(app,connection);

// lsiten to port
app.listen(3000);
console.log("App running on port 3000");