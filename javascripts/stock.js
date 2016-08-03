////alert("connected");
var compCodeData = [];
var compCodes = [];
var compCompanies = [];

    var socket = io();
/////////

$(document).ready(function() {
    
  socket.emit('findAllStock', function (data) {
     console.log("found!: ")
      console.log(data);
      if ( $('#chart').html().length == 0 ) {
} else if($('#chart').html().length > 0 ){
    //alert("here empty");
    $( "#chart" ).empty();
} else{
    //
}
});       

});
/////////
$('body').on('click', '.del', function(del) {
  console.log("found!: ");
  console.log(del);
var compcode = del.currentTarget.id;
   //alert(compcode);
 $(this).parent('li').remove();
 socket.emit('delStock', compcode); 
 javascript:window.location.reload();
 }); 
//////////

////////////
socket.on('finishDel', function(data){
  if (data) {
  //alert("ok");
   socket.emit('findAllStock', function (data) {
     console.log("found!: ")
      console.log(data);
    });
  } 
  else {
   //alert("here!!!!! trouble!");
    $('#stockcodes').html('OK!');
   socket.emit('findAllStock', function (data) {
     console.log("found!: ")
      console.log(data);
    });
   
  }
});

/////////
            
socket.on('allStock', function(data){
  if (data) {
          $( "#stockcodes" ).empty();
          //alert("display");
      for(var i = 0; i< data.length; i++){
          $('#stockcodes').append('<li class="list-group-item"><i>: ' + data[i].company + '</i><p>' +  data[i].compcode + '<button type="button" id="'+data[i].compcode+'" class="del" click="()"> X </button></p></li>');
      
             var company = data[i].company;
      // //alert (company);
        var companyData = data[i].data;
        var compcode = data[i].compcode;
      
      if(compCodes.indexOf(data[i].compcode) !== -1) {
       // //alert ('stock already exists!');
}
else{
         
      compCodeData.push(data[i].data);
      compCodes.push(data[i].compcode);
      compCompanies.push(data[i].company);
}
}
      
   //alert("here draw3");
   if ( $('#stockcodes').html().length == 0 ) {
	// length is 0
//	alert("here draw3.1");
	 drawChart(compCompanies,compCodes, compCodeData);
} else if($('#stockcodes').html().length > 0 ){
   // alert("here empty");
    //$( "#stockcodes" ).empty();
    drawChart(compCompanies,compCodes, compCodeData);
} else{
 //  
    drawChart(compCompanies,compCodes, compCodeData);
}   

  } else {
  // 
  var div = document.getElementById('stockcodes');

div.innerHTML = div.innerHTML + 'bad' + data;

 drawChart(compCompanies,compCodes, compCodeData);
  }
});
////////////
socket.on('addstock', function(data){
  if (data) {
  alert("ok");
  } 
  else {
   //alert("here!!!!! trouble!");
    $('#stockcodes').html('OK!');

   socket.emit('findAllStock', function (data) {
     console.log("found!: ")
      console.log(data);
      //alert("here draw4");
      //drawChart(compCompanies,compCodes, compCodeData);
    });
   
  }
});
 
$('body').on('click', '#findcode', function(del) {
    //alert(compCodeData);
  $('#stockcodes').text('');
  var compcode = $('#compcode').val().toUpperCase();
  //alert(compcode);
  //compCodeData = ['MSFT', 'AAPL', 'GOOG'];
 var a = compCodeData.indexOf(compcode); 
 if( a == null || a == "" ){
  a = -1;
 }
// //alert(a);
  if (a !== -1) {
      //alert("here1");
    $("#stockcodes").append("<b>Already shown or not available: " + compcode + "</b>");
    ////alert (compCodeData);
  } else if (a === -1) {
      //alert("here!");
    socket.emit('findStock', compcode, function (data) {
     //alert("found!: ")
      console.log(data);
       if (data) {
      for(var i = 0; i< data.length; i++){
      $('#msg').append('<br />Good ' + data[i].company + ' and ' + data[i].compcode + '<br />');
      }
      
       }else{
         $('#msg').append('<br />Good <br />');
       }
    });
  } 
  javascript:window.location.reload();
 });
 
 function validateForm() {
    var x = $('#compcode').val();
    if (x == null || x == "") {
        //alert("Company Code must be filled in!");
        return false;
    }
}

var drawChart = function (compCompanies,compCodes, compCodeData) {  
    //alert("before");
 ///////////////////////////////////

for(var z = 0; z < compCodeData.length ; z++){
  
for(var a = 0; a < compCodeData[z].length ; a++){
  
for(var b = 0; b < compCodeData[0][0].length ; b++){
compCodeData[z][a][b] = new Date(compCodeData[z][a][b]).getTime();
// //alert(compCodeData[0][b][0]);
}
}
}

console.log(compCodeData);
console.log(compCompanies);
console.log(compCodes);
 var seriesOptions = [],
        seriesCounter = 0,
        names = compCodes;
        //alert(names);

    /**
     * Create the chart when all data is loaded
     * @returns {undefined}
     */
    function createChart() {

        $('#chart').highcharts('StockChart', {
            
            title: {
            text: 'STOCKS'
        },
        
         chart: {
            backgroundColor: '#E7D3ED'
        },

            rangeSelector: {
                selected: 4
            },

            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value + '%';
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'percent'
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2
            },

            series: seriesOptions
        });
    }
    
    for(var k = 0; k< names.length; k++){
    seriesOptions[k] = {
                name: names[k],
                data: compCodeData[k]
            };

            // As we're loading the data asynchronously, we don't know what order it will arrive. So
            // we keep a counter and create the chart when all the data is loaded.
            seriesCounter += 1;

            if (seriesCounter === names.length) {
                 //alert(JSON.stringify(seriesOptions, null, 4));
                createChart();
            }
    }
};