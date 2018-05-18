var C_COLS_LEAVE = 1;
var C_ROWS_LEAVE = 25;


function deleteEmptyCells() {
  var file = SpreadsheetApp.getActive();
  var sheets = file.getSheets();  
  for (var i = 0, l = sheets.length; i < l; i++) { deleteEmptyCellsSheet_(sheets[i]); }
  return 0;  
  
}

function deleteEmptyCellsSheet_(sheet)
{
  // columns
  var cLast = sheet.getLastColumn();
  var cEnd = sheet.getMaxColumns();
  if ( (cEnd - cLast) > C_COLS_LEAVE ) 
  {
    var numC = cEnd - cLast - C_COLS_LEAVE;
    sheet.deleteColumns(cLast + 1, numC);  
  }
  
  // rows
  var rLast = sheet.getLastRow();
  var rEnd = sheet.getMaxRows();
  if ( (rEnd - rLast) > C_ROWS_LEAVE ) 
  {
    var numC = rEnd - rLast - C_ROWS_LEAVE;
    sheet.deleteRows(rLast + 1, numC);  
  }  
}