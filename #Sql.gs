function test_AlaSql2()
{
  var file = SpreadsheetApp.getActive();
  var sheet = file.getSheetByName('Data');
  var range = sheet.getRange('A2:C8');
  var data = range.getValues();
  
  var sql = "select * from ? where Col1 < 2020 and Col2 = 'a'";
  
  Logger.log(convertAlaSqlResultToArray_(getAlaSqlResult_(data, sql)));
  // [[2016.0, a, 1.0], [2016.0, a, 2.0], [2018.0, a, 4.0], [2019.0, a, 5.0]]
  
  

}


function getAlaSqlResult_(data, sql)
{
  var request = convertToAlaSql_(sql);
  var res = alasql(request, data);
  // [{0=2016.0, 1=a, 2=1.0}, {0=2016.0, 1=a, 2=2.0}, {0=2018.0, 1=a, 2=4.0}, {0=2019.0, 1=a, 2=5.0}]
  return convertAlaSqlResultToArray_(res);
}



function convertToAlaSql_(string)
{
  var result = string.replace(/(Col)(\d+)/g, " [$2]");
  result = result.replace(/\[(\d+)\]/g, function(a,n){ return "["+ (+n-1) +"]"; });
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