//Build Chart the Stock Market App
//FCC API Basejump: Build Chart the Stock Market App
//25.07.2016
'use strict';

var mongo = require('./mydatabaseconn.js');

var ejs = require('ejs');

var express = require('express');

var routes = require('./routes');

//var app = express();
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var morgan = require('morgan');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');

////////////

app.use(morgan('dev')); // logger

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use('/', express.static(process.cwd() + '/')); 
      
var port = process.env.PORT || 8080;

app.get('/', routes.index);

app.get('/getStocks/:all*', routes.getStocks);
 
 app.get('/delStocks', function(data, req, res) { 
  var end = routes.delStockButtonClick(function(dataset) {
   }); 
    res.send(end);
 });


var stock = routes.stock;
var all = routes.getStocks;
var del = routes.delStock;

io.on('connection', function(socket){
    socket.on('delStock', function(compcode){
      console.log("Ser comp: " + compcode);
     socket.on('error',function(er){
    console.log(er);
});
       var  data = del(compcode);
      console.log("SerVER OK DEL :");
     // console.log(data);
       io.emit('finishDel', data);

    });
});
///
io.on('connection', function(socket){
    socket.on('findStock', function(compcode){
      console.log("Ser comp: " + compcode);
     socket.on('error',function(er){
    console.log(er);
});
       var  data = stock(compcode);
      console.log("SerVER OK GO :");
      // console.log(data);
       io.emit('addstock', data);

    });
});

io.on('connection', function(socket){
    socket.on('findAllStock', function(){
      console.log("GOcomp: ");
     socket.on('error',function(er){
    console.log(er);
});
       var  data = all();
      console.log("SerVER :");
      // console.log(data);
       
       setTimeout(function() 
       
       {
           console.log("SerVER :");
       //console.log(data);
          io.emit('allStock', data);
           
       },3000);
    });
});

mongo.init(function (error) {
    if (error)
        throw error;
    io.on('connection', function(){ 
        /* … */
        console.log('Node.js ... HERE ... listening on port ' + port + '...');
        });
    server.listen(port);
});