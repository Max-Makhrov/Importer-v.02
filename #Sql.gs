function test_AlaSql2()
{
  var file = SpreadsheetApp.getActive();
  var sheet = file.getSheetByName('Data');
  var range = sheet.getRange('A2:C8');
  var data = range.getValues();
  
  var sql = "select * from ? where Col1 < 2020 and Col2 = 'a'"
  Logger.log(convertAlaSqlResultToArray_(getAlaSqlResult_(data, sql)));
  // [[2016.0, a, 1.0], [2016.0, a, 2.0], [2018.0, a, 4.0], [2019.0, a, 5.0]]
  
  

}

function test_replace()
{
  
 Logger.log(convertToAlaSql_("select * from ? a outer join ? b on a.Col1 = b.Col1", 70)); 
  
}


function getAlaSqlResult_(data, sql)
{
  if(data.length === 0) { return []; };
  var request = convertToAlaSql_(sql, data[0][0].length);
Logger.log(request);  
  var res = alasql(request, data);
  // [{0=2016.0, 1=a, 2=1.0}, {0=2016.0, 1=a, 2=2.0}, {0=2018.0, 1=a, 2=4.0}, {0=2019.0, 1=a, 2=5.0}]
  return convertAlaSqlResultToArray_(res);
}



function convertToAlaSql_(string, l)
{
  var result = string.replace(/(Col)(\d+)/g, "[$2]");
  
  // replace Col1... with [0]
  result = result.replace(/\[(\d+)\]/g, function(a,n){ return "["+ (+n-1) +"]"; });
  
  // replace select * with all calumns selected
  var getColsLen_ = function(len) {
    var result = [];
    for (var i = 0; i < l; i++) { result.push('[' + i + ']'); }
    return ' ' + result.join(', ');    
  };  
  
  return result.replace(/ (\*)/, getColsLen_(l));
  return result;
}


function convertAlaSqlResultToArray_(res)
{
  var result = [];
  var row = [];
  res.forEach
  (
  function (elt)
  {
    row = [];
    for (var key in elt) { row.push(elt[key]); }
    result.push(row);
  }  
  );
  return result;
}