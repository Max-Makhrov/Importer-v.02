var C_SPLIT_CODES = '&';


function runSelectiveImport_()
{
  var selectedTasks = '9;10'; // may be more task IDs: "1;2;5"
  writeDataFromSheets(selectedTasks);  
}

/*
  selectedTasks = /string/ "1;2"
                            List of tasks for selective import. Use `;` = STR_DELIMEER1

 
*/
function writeDataFromSheets(selectedTasks)
{
  var start = new Date(); // timer start
  
  getSettings_();
    
  // targets
  var allTargetIds = STR_TASKIDS.split(STR_DELIMEER1);
  var allFileIdsTo = STR_FILEID_TARGET.split(STR_DELIMEER1);
  var allSheetNamesTo = STR_SHEET_TARGET.split(STR_DELIMEER1);
  var allSqlTexts = STR_SQL_TEXTS.split(STR_DELIMEER1);
  var allCellsTarget = STR_RANGES_TARGET.split(STR_DELIMEER1);
  var allClearDataTarget = STR_CLEARDATA_TARGET.split(STR_DELIMEER1);
  var allDoTasks = STR_DO_TARGET.split(STR_DELIMEER1);

  // sources
  var sourcesIdsTasks = STR_TASKIDS_SOURCES.split(STR_DELIMEER1);
  var sourcesIdsFiles = STR_FILEIDS_SOURCES.split(STR_DELIMEER1);
  var sourcesSheetNames = STR_SHEETNAMES_SOURCES.split(STR_DELIMEER1);
  var sourcesRanges = STR_RANGES_SOURCES.split(STR_DELIMEER1);
  var sourcesSqls = STR_SQL_SOURCES.split(STR_DELIMEER1);
  
  
  
  // selective tasks
  if (typeof selectedTasks !== "undefined")   
  {     
    // double check
    if (selectedTasks.length > 0 && typeof selectedTasks === 'string') 
    {    
      // get all tasks to do from selected by a user
      allDoTasks = getSelectiveTasks_(allTargetIds, selectedTasks.split(STR_DELIMEER1));   
    }
    else
    {
      // dealing with event trigger?      
      if (typeof selectedTasks.hour !== "undefined")
      {
        if (NUM_RUN_TRIGGER != 1) { return -1; } // trigger is set not to run!
      }      
    }    
  }
  
  
  
  // get sources
  var sourcesArray = sourcesIdsTasks.map(function(elt, i) { return [elt, sourcesIdsFiles[i] + C_SPLIT_CODES + sourcesSheetNames[i] + C_SPLIT_CODES + sourcesRanges[i]]; } );
  var sources = {};
  var source = {};
  sourcesIdsTasks.forEach
  (
  function(elt, i) 
    {
      var key = sourcesIdsFiles[i] + C_SPLIT_CODES + sourcesSheetNames[i] + C_SPLIT_CODES + sourcesRanges[i];
      if (!(key in sources))
      {
        sources[key] = {};
        source = sources[key];
        source.subTaskIds = [sourcesIdsTasks[i]];
        source.data = []; 
        source.sqlArray = [sourcesSqls[i]];
      }
      else
      {
        source = sources[key];
        source.subTaskIds.push(sourcesIdsTasks[i]);
        source.sqlArray.push(sourcesSqls[i]);
      }
  
  
    } 
  );
  
  // get tasks & subTasks
  var tasks = {};
  var task = {};
  var subTasks = {};
  var subTask = {}; 
  allTargetIds.forEach(
  function(elt, i) {
    var doTask = allDoTasks[i];
    if (doTask == 1)
    {
      var taskKey = allFileIdsTo[i] + C_SPLIT_CODES + allSheetNamesTo[i] + C_SPLIT_CODES + allCellsTarget[i];
      // get tasks objects
      if (!(taskKey in tasks))
      {
        tasks[taskKey] = {}; 
        task = tasks[taskKey];		
        task.clearDataTarget = allClearDataTarget[i];
        task.subTasksIds = [elt];	  
      }
      else
      {
        task = tasks[taskKey];
        task.subTasksIds.push(elt);
      }
      // get subTask object
      subTasks[elt] = {};
      subTask = subTasks[elt];
      subTask.sql = allSqlTexts[i];
      subTask.sourceIds = sourcesArray.filter(function(source) { return source[0] == elt; } );      
    }

  });
  
  
  
  /*  
  Logger.log(tasks);
  --------------------------------------------------------------------------------
   {1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Archive&A3=
      {clearDataTarget=1, subTasksIds=[5]}, 
    1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Grades&A2=
       {clearDataTarget=1, subTasksIds=[1]}, 
    1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Old Archive&A3=
       {clearDataTarget=1, subTasksIds=[6]}, 
    1H5hBWZunzMrY8GwM0mBEZgIHhnE42WAuUO_JD0vK6VY&Man. Artists&A2=
       {clearDataTarget=1, subTasksIds=[2, 3]}, 
    1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Tasks&A3=
       {clearDataTarget=1, subTasksIds=[4]}}
       
 

   Logger.log(subTasks[6]); 
   --------------------------------------------------------------------------------
       {sourceIds=
          [
            [6, 1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Old Archive&A3:AQ3], 
            [6, 1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Archive&A3:AQ3]
          ], 
       sql=select * from ? a outer join ? b on a.Col1 = b.Col1}
  
   
   
   Logger.log(sources);
   --------------------------------------------------------------------------------
   {1H5hBWZunzMrY8GwM0mBEZgIHhnE42WAuUO_JD0vK6VY&#Grades&a3:d3=
      {data=[], subTaskIds=[1], sqlArray = ['select * from ?']}, 
    1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Tasks&A2:AG2=
      {data=[], subTaskIds=[2], sqlArray = ['select * from ?']}, 
    1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Archive&A3:AQ3=
      {data=[], subTaskIds=[6], sqlArray = ['select * from ?']}, 
    1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Archive&A2:AG2=
      {data=[], subTaskIds=[3], sqlArray = ['select * from ?']}, 
    1H5hBWZunzMrY8GwM0mBEZgIHhnE42WAuUO_JD0vK6VY&Task Artists&A7:BU7=
      {data=[], subTaskIds=[4, 5], ssqlArray = ['select * from ?', 'select * from ?']}, 
    1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Old Archive&A3:AQ3=
      {data=[], subTaskIds=[6],  sqlArray = ['select * from ?']}}
   
   
   */


 // do tasks
 var subTaskIds = [];
 for (var key in tasks) {
 
  task = tasks[key];
Logger.log(key);
Logger.log(task); 
  subTaskIds = task.subTasksIds;
   
  var data = getDataFromSubTasks_(subTaskIds, subTasks, sources);   
   
  if (data.length > 0) 
  {
   // write the result into sheet
    var fileSheetRange = key.split(C_SPLIT_CODES); 
    var file = SpreadsheetApp.openById(fileSheetRange[0]);
    var sheet = createSheetIfNotExists(file, fileSheetRange[1]);
    var range = sheet.getRange(fileSheetRange[2]);
    var row = range.getRow();
    var col = range.getColumn(); 
Logger.log(data[data.length - 1]);    
    clearDataInTarget_(task.clearDataTarget, row, col, sheet, data[0].length);
    writeDataIntoSheet_(file, sheet, data, row, col);
  }   
 }
  
  Logger.log(new Date() - start); // timer end
  
}



function test_getSelectiveTasks_()
{
  var allTargetIds = "1;2;3;4;5;6".split(';');
  var selectedTasks = "1;5;8".split(';');
  Logger.log(getSelectiveTasks_(allTargetIds, selectedTasks));
  // [1, 0, 0, 0, 1, 0]
}

/*
  allTargetIds = ['1','2','3','4','5','6']
  selectedTasks = ['1', '5', '8']
  
  
  output:        [ 1,  0,  0,  0,  1,  0 ]
*/
function getSelectiveTasks_(allTargetIds, selectedTasks)
{
  var isIn_ = function(elt) { if (selectedTasks.indexOf(elt) > -1) { return '1'; } else { return '0'; } };
  var result =  allTargetIds.map(isIn_);
  return result;  
}



function clearDataInTarget_(cleardata, row, col, sheet, l)
{  

  if(cleardata != 1) { return -1; }
  var numRows = sheet.getLastRow() - row + 1;
  if (numRows < 1) { return -2; } 

  
  var rangeToClear = sheet.getRange(row, col, sheet.getLastRow() , l);
  rangeToClear.clearContent();  
}


function getDataFromSubTasks_(subTaskIds, subTasks, sources)
{  
  /*
     subTaskIds = [2, 3] 
     
   
   Logger.log(subTasks[6]); 
   --------------------------------------------------------------------------------
       {sourceIds=
          [
            [6, 1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Old Archive&A3:AQ3], 
            [6, 1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Archive&A3:AQ3]
          ], 
       sql=select * from ? a outer join ? b on a.Col1 = b.Col1}  
  
  
  sources[...]:
  --------------------------------------------------------------------------------
   {1H5hBWZunzMrY8GwM0mBEZgIHhnE42WAuUO_JD0vK6VY&#Grades&a3:d3=
      {data=[], subTaskIds=[1]},  
  */
  var array = [];
  var arrays = []; // array of arrays
  var subTask = {};
  for (var i = 0, l = subTaskIds.length; i < l; i++)
  {
    var subTaskKey = subTaskIds[i]; // 2, 3
    subTask =  subTasks[subTaskKey]; // { sourceIds = [...], sql = select... }
    array = getDataFromSubTask_(subTask.sourceIds, subTask.sql, sources, subTaskKey);
    if('null' != array && array[0] != undefined) { arrays.push(array); }     
  }
 
  
  return combine2DArrays_(arrays);
}



function getDataFromSubTask_(sourceIds, sqlText, sources, subTaskKey)
{


  /*
    sourceIds=
          [
            [6, 1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Old Archive&A3:AQ3], 
            [6, 1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Archive&A3:AQ3]
          ]

   */
  var dataSets = [];
 Logger.log('-----------------------ggg-----------------'); 
  Logger.log(sourceIds);
  Logger.log(sources);
  Logger.log(subTaskKey);
 Logger.log('-----------------------ggg-----------------');  
  
  sourceIds.forEach(
  function(elt)
  {
    var data = getDataFromSource_(elt[1], sources, subTaskKey);
    if('null' != data && data[0] != undefined) { dataSets.push(data); }                   
  }
  );
        
  var result = getResultFromRequset_(dataSets, sqlText);
      
  return result;
  
}



function getDataFromSource_(key, sources, subTaskKey)
{
  /*
    key = "1dqmE-yidoQALNKLxDnunDaXDhrq5P45koFt-VpnqWPU&Old Archive&A3:AQ3"
    
  
    sources[...]:
    --------------------------------------------------------------------------------
     {1H5hBWZunzMrY8GwM0mBEZgIHhnE42WAuUO_JD0vK6VY&#Grades&a3:d3=
        {data=[], subTaskIds=[1], sqlArray = ['select * from ?']},  
  */
  var source = sources[key];  
  
  // delete subTasksKey from subTaskIds
  var subTaskIds = source.subTaskIds;     
  
  var index = subTaskIds.indexOf(subTaskKey);
  subTaskIds.splice(index, 1); // delete sub-task we are doing
  var sqlArray = source.sqlArray;
  var sql = sqlArray[index]; 
  sqlArray.splice(index, 1); // delete sub-task we are doing
   
    
  source.subTaskIds = subTaskIds; // return to original array
  source.sqlArray = sqlArray; // return to original array
  
  var data = source.data;  
  
  // get data from dource
  var result = [];
  if (data.length === 0)
  {
   // need to det data here...    
Logger.log('get data');
    var params = key.split(C_SPLIT_CODES);
    var sheet = SpreadsheetApp.openById(params[0]).getSheetByName(params[1]);
    var r1 = sheet.getRange(params[2]);
    var row1 = r1.getRow();
    var col1 = r1.getColumn();
    var col2 = r1.getLastColumn();    
    var row2 = sheet.getLastRow(); // last row from sheet
    // if range if out of bound    
    if (row2 < row1) { row2 = row1; } // get blank array
         
    var range = sheet.getRange(row1, col1, row2-row1+1, col2-col1+1);  
    result = range.getValues();      
       
  }
  else
  {
    result = data;
  }
  
  // delete or remember 
  if(subTaskIds.length === 0)
  {
Logger.log('delete data');
    source.data = [];     
  }
  else
  {
Logger.log('remember data');    
    source.data = result;  
  }
  
  result = getAlaSqlResult_([result], sql); 
    
  sources[key] = source; // return modified source
  return result;
  
  
  
}

 

// combine 2d arrays of different sizes
function combine2DArrays_(arrays)
{
  
  // check 2D-arryas are not empty
  if (arrays.length === 1 && arrays[0].length === 0) { return arrays[0]; }
  
  // detect max L
  var l = 0;
  var row = [];
  var result = [];
  var elt = '';
  arrays.forEach(function(arr) { l = Math.max(l, arr[0].length); } );
  arrays.forEach(function(arr) {
    for (var i = 0, h = arr.length; i < h; i++)
    {
      var row = arr[i];
      // fill with empty value
      for (var ii = row.length; ii < l; ii++) { row.push(''); }
      result.push(row);
    }
  }
  );  
  return result;
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
function writeDataIntoSheet_(file, sheet, data, rowStart, colStart) {
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







function triggerWriteDataFromSheets_()
{
  var nameFunction = 'writeDataFromSheets';
  setTriggerOnHour_(nameFunction)
}


function setTriggerOnHour_(nameFunction)
{
  if (checkTriggerExists_(nameFunction, 'SPREADSHEETS')) { return -1; } // trigger exists
  var ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger(nameFunction)
      .timeBased()
      .everyHours(1)
      .create();

}


/*
  USAGE
  
  var exists = checkTriggerExists_('test_getSets', 'SPREADSHEETS')
*/
function checkTriggerExists_(nameFunction, triggerSourceType)
{
  var triggers = ScriptApp.getProjectTriggers();
  var trigger = {};

  
  for (var i = 0; i < triggers.length; i++) {
   trigger = triggers[i];
   if (trigger.getHandlerFunction() == nameFunction && trigger.getTriggerSource() == triggerSourceType) return true;
  }
  
  return false; 

}
