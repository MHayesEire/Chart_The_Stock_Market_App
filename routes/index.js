/// index.js routes - uses Quandl API

    
//var db = app.settings.db;
var mongo = require('../mydatabaseconn.js');

var Quandl = require("quandl");
var quandl = new Quandl();
 
var qkey = process.env.QUANDL;

var options = {
    auth_token: "TfXngLy-TihBZZZZZZZZZZZZZZ"
};
 
quandl.configure(options);

/*
 * GET home page.
 */

exports.index = function(req, res){
var db = mongo.client;
  var collection = db.collection('stocklist');

var myStock = [];
var myCode = [];
var myData = [];
var cursor = collection.find({});

    
        res.render('pages/index', {
               title: 'Chart The Stock Market App',
                data: myData,
                company: myStock,
                compcode: myCode
            });
};


////////////////


exports.delStockButtonClick = function(data,req, res) {
    console.log("db0: ");
     var db = mongo.client;
    //console.log(mongo);
    var query = data;
    console.log(query);
    console.log('query');
db.collection('stocklist', function(err, collection) {
           if (err) throw err; 
    collection.findOne({ 'compcode': query }, function(err, stock) {
    if (err) throw err; 
    if (stock)  {
        console.log("stock exists");
        console.log(stock);
        // delete stock code record....
        ///////////////////////
        
        db.collection('stocklist', function(err, collection) {
         if (err) throw err;
	// find the stock code with the list.
      collection.remove({'compcode': query }, {w:1}, function (err, result) {
        if (err) throw err;
        console.log("Result from removing stock code: ");
        console.log(result);
       //res.redirect('/');
        res.render('pages/index', {
                title: 'Chart The Stock Market App',
                data: data,
                company: 1,
                compcode: 1,
                res: result
            });
      });
    });
    }
    }); 
    });                      
}

////////////////



////////////////
exports.delStock = function(data) {
    console.log("db0: ");
     var db = mongo.client;
    //console.log(mongo);
    var query = data;
    console.log(query);
    console.log('query');
////
delSt(query, mongo.client, function(result0) {
                   
         console.log(result0);
         
         
         setTimeout(function() 
       
       {
         return result0;
           
       },1000);
    });

////

                     
}

////////////////
exports.getStocks = function(all) {
    console.log("HERE");
    var db = mongo.client;
    var all = all;
 var cursor = db.collection('stocklist').find().sort({ when: -1 });
        cursor.skip(0);
        
         var result = [];

          cursor.each(function(err, item) {
             if(item == null) {
                //db.close();
                 // callback(result);
                 console.log (result);
                return result;
            }
        console.log(err);
          //console.log(item);

             result.push({company: item["company"], compcode: item["compcode"],data: item["data"] });
             //console.log(JSON.stringify(result));
    });
    return result;
   }; 

//////////////////////////////////

function getStock(db, callback) {
  getStockData(db, function(data) {
    callback(data);
  });
}

function getStockData(db, callback) { 
        var cursor = db.collection('stocklist').find().sort({ when: -1 });
        cursor.skip(0);
        
         var result = [];


          cursor.each(function(err, item) {
             if(item == null) {
                //db.close();
                  callback(result);
                return;
            }
        console.log(err);
          //console.log(item);

             result.push({company: item["company"], compcode: item["compcode"],data: item["data"] });
             console.log(JSON.stringify(result));
    });
   }    

//////


///////////////
exports.stock = function (data){
        //console.log (mongo.client);
quandlGo(data, function(result) {
    stockSave(result, mongo.client, function(result) {
           return result;
});               
}); // end stock call 

}
//////////////////////////

function quandlGo(data, callback ){
    var Quandl = require("quandl");
var quandl = new Quandl();
 
var qkey = process.env.QUANDL;

var options = {
    auth_token: "TfXngLy-TihBZZZZZZZZZZZZZZZZZZZ"
};
 
quandl.configure(options);
 quandl.dataset({
  source: "WIKI",
  table: data 
}, {
  order: "asc",
  exclude_column_names: true,
  start_date: "2015-06-01",
  end_date: "2016-08-03",
  column_index: 4
}, function(err, response){
    if (err) {
        console.log(err);
        callback(err); 
        return;}
    response = JSON.parse(response);
//console.log("own: ");
   //     console.log(response);
  callback (response);
      });
}

//////////////////////////////////
function stockSave(stock, mongo, callback) {
  getData(stock, mongo, function(data) {
    callback(data);
  });
}
   
function getData(stock, mongo, callback) {
    console.log ("STOCK");
   console.log(stock);
   //console.log(stock.quandl_error);
   if(stock.quandl_error){
       callback();
   }
   else{
   // console.log(mongo);
    var company = stock.dataset.name;
    var word=company.split(" Prices");
    company =word[0];
    console.log(word[0]);
    console.log(word[1]);
     var compcode = stock.dataset.dataset_code; 
       var data = stock.dataset.data; 

     var query = {   'company' : company,
                                'compcode' : compcode,
                                'data': data};
                     
 mongo.collection('stocklist', function(err, collection) {
           if (err) throw err; 
    collection.findOne({ 'compcode': compcode }, function(err, code) { 
    
    if (err) throw err; 
    if (code) { 
        console.log("code exists");
        //console.log(code);
        callback(code);
    }
    else{
        // insert code
     var squery = mongo.collection('stocklist'); 
        console.log(squery);
        squery.insert(query, function(err, result1) { 
         if (err) throw err; 
            console.log('Saved ');
            console.log( result1); 
            //return result;
        callback(result1);
        });
    }
    }); 
    }); 
}
    }
/////////////////


//////
function delSt(query, db, callback) {
  delStData(query, db, function(data) {
    callback(data);
  });
}
   /// 
function delStData(query, db, callback) { 
      // delete in db collection
db.collection('stocklist', function(err, collection) {
           if (err) throw err; 
    collection.findOneAndDelete({ 'compcode': query }, function(err, stock) {
    if (err) throw err; 
    if (stock)  {
        
        console.log("stock exists");
        console.log(stock);
        console.log("Result from removing stock code: ");
        // delete stock code record....
        ///////////////////////
       callback(stock);
    } else{
        callback(stock);
    }
    }); 
    });      
}

//////////////////////////////////