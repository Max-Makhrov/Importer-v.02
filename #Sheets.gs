/*
  Creates sheet if it does not exist
  Returns sheet object
 
  * ss           SpreadSheet                 default: current sheet
  * name         Name of sheet
*/
function createSheetIfNotExists(ss, name) { 
  var ss = ss || SpreadsheetApp.getActiveSpreadsheet();

  try {ss.setActiveSheet(ss.getSheetByName(name));}
    catch (e) {ss.insertSheet(name);} 
  
  var sheet = ss.getSheetByName(name);
  return sheet;
}

function getThisSheetId()
{
  return SpreadsheetApp.getActive().getId();
}



/*
    use getSheetsInfo(ids)
    
    write the report into sheet:
    
    input:
      * file                       SpreadSheet
      * strSheet                   'Sheet1'
      * data                       [['Name', 'Age'], ['Max', 28], ['Lu', 26]]
                              
  If strSheet doesn't exist → creates new sheet
                                    
*/
function writeDataIntoSheet(file, sheet, data, rowStart, colStart) {
  file = file || SpreadsheetApp.getActiveSpreadsheet();
  
  // get sheet as object
  switch(typeof sheet) {
    case 'object':
        break;
    case 'string':
        sheet = createSheetIfNotExists(file, sheet);
        break;
    default:
        return 'sheet is invalid';
  }
  
  // get dimansions and get range
  rowStart = rowStart || 1;
  colStart = colStart || 1;   
  var numRows = data.length;
  var numCols = data[0].length; 
  var range = sheet.getRange(rowStart, colStart, numRows, numCols);
  
  // clear old data if rowStart or colStart are not defined
  if(!rowStart && !colStart) { sheet.clearContents(); }

  
  // set values
  range.setValues(data);
  
  // report success
  return 'Wtite data to sheet -- ok!';

}