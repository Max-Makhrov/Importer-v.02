var C_idFileFrom = '1bslkvNqLsp3_W1KeNXT4QPDbSxVu_DOFWYErpbccuiw'; // sample file for copy
var C_sheetNames = ['Ini', 'Targets', 'Sources'];

function installImporter()
{
  var file = SpreadsheetApp.getActive();
  var idFileTo = file.getId();
  
  var sheetNames = C_sheetNames;
  
  // exit if sheets with same name exist
  var sheets = file.getSheets();
  
  sheets.forEach(function(sht) 
  { 
    if (sheetNames.indexOf( sht.getName() ) > -1)
    {
      throw 'Error. Sheet ' + sht.getName() + ' already exists.';
      return -1;    
    }
  });
  
  var idFileFrom = C_idFileFrom
  copySheets_(idFileFrom, idFileTo, sheetNames);
  
  return 0;
  
}
