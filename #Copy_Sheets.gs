/* Done!
  1. Copy multiple sheets between files with 1 click
  2. Delete "copy of..." from sheet name. Leave original name if possible*.
  3. Delete and recreate named ranges. Leave original name if possible.
  4. Repair formulas → to prevent #N/A, #Ref errors
  
  * no naming conflicts
  
*/

function copySheets_(idFileFrom, idFileTo, sheetNames)
{
  var sheets = [];
  for (var i = 0, l = sheetNames.length; i < l; i++) { sheets.push(copySheet_(idFileFrom, idFileTo, sheetNames[i])); }  
  
  // Reset formulas  ***************************************************************************************//
  sheets.forEach(
    function(sheet)
    {
      var range = sheet.getDataRange();
      restoreFormulas_(range);
    }
  );

}



function copySheet_(idFileFrom, idFileTo, sheetName) {
  
  var file1 = SpreadsheetApp.openById(idFileFrom);
  var file2 = SpreadsheetApp.openById(idFileTo);    
  
  // remember all named ranges from fileTo ***************************************************************//
  var namedRangesFile = file2.getNamedRanges();
  var occupiedRangeNames = [];
  namedRangesFile.forEach(function(elt)
  {
    occupiedRangeNames.push(elt.getName());
  });  
  
  
  // copy sheet  *****************************************************************************************//
  var sheet1 = file1.getSheetByName(sheetName);    
  sheet1.copyTo(file2); // will create the copy in the end
  var sheets = file2.getSheets();
  
  // rename sheet if possible  ***************************************************************************//
  var newSheet = sheets[sheets.length - 1];
  var sheetNames = [];
  sheets.forEach(function(elt) { sheetNames.push(elt.getName()); } );
  if (sheetNames.indexOf(sheetName) === -1) { newSheet.setName(sheetName); } // if no such sheet exists
  
  // recreate named ranges if possible  *******************************************************************//
  var namedRangesSheetNew = newSheet.getNamedRanges();
  var namedRangesSheet = sheet1.getNamedRanges();
  // read named ranges from sheet1
  var oNamedRanges = {};
  namedRangesSheet.forEach
  (function(elt, index)
  {
    var name = elt.getName();
    if (occupiedRangeNames.indexOf(name) === -1)
    {
      var namedRangeNew = namedRangesSheetNew[index];
      // remember
      oNamedRanges[name] = {};
      oNamedRanges[name].place = namedRangeNew.getRange().getA1Notation();
      oNamedRanges[name].range = namedRangeNew;
    }    
  });
  // delete and recreate
  for (var name in oNamedRanges)
  {
    oNamedRanges[name].range.remove();
    file2.setNamedRange(name, newSheet.getRange(oNamedRanges[name].place));    
  }
  
  return newSheet;
  
}


function restoreFormulas_(range)
{ 
  var sheet = range.getSheet(); 
  var values = range.getValues();
  var formulas = range.getFormulas();
  
  var ll = values[0].length;
  for (var r = 0, l = values.length; r < l; r++)
  {
    for (var c = 0; c < ll; c++)
    {
      var value = values[r][c];
      var formula = formulas[r][c];
      // duck type bad formula
      if (formula.match("!") && value === '#N/A') 
      { sheet.getRange(r + 1, c + 1).setFormula(formula + ' '); }    
    }    
  }

}