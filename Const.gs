var C_RANGE_EVAL = 'eval';



// Declare
var STR_DELIMEER1; // delim1
var STR_DELIMEER2; // delim2
var STR_TASKIDS; // task Ids for sources
var STR_FILEID_TARGET; // file where to
var STR_SHEET_TARGET; // sheet where to
var STR_SQL_TEXTS; // SQL texts
var STR_RANGES_TARGET; // Start import from cell
var STR_CLEARDATA_TARGET; // Clear tardet data (1 = true)
var STR_TASKIDS_SOURCES; // Task Ids for sources
var STR_FILEIDS_SOURCES; // file ids sources
var STR_SHEETNAMES_SOURCES; // sheet names sources
var STR_RANGES_SOURCES; // ranges sources
var STR_SQL_SOURCES; // sql for sources

// get settings from named range
function getSettings()
{
  var range = SpreadsheetApp.getActive().getRangeByName(C_RANGE_EVAL);
  
  /*
    sample data for this script looks like this:    
    [
      ";",
      "~",
      "1LC6QmhBU-0OhUWo7R_eKPjuSCkmdpl6tRHPu83Co3Hk;1389-68_t6yFVQb72P8YhBPaTEnyE7sxJ7Imd9tPNF08;14L2QMZBtwzWDz-IkALq9-EUjdjvKDPdJJ9EyodSidRs",
      "Sales Central;Sales West;Sales East",
      "A2:G2;A2:G2;A2:G2",
      "Sales Total;Sales Total;Sales Total",
      "A2"
    ]
    Note:
    The data is collected from a cell of named range called "eval"
  */
  
  var value = range.getValue().replace(/\n/g, " "); // replace new line with space
  var data = JSON.parse(value);
  
// Assign
STR_DELIMEER1 = data[0];
STR_DELIMEER2 = data[1];
STR_TASKIDS = data[2];
STR_FILEID_TARGET = data[3];
STR_SHEET_TARGET = data[4];
STR_SQL_TEXTS = data[5];
STR_RANGES_TARGET = data[6];
STR_CLEARDATA_TARGET = data[7];
STR_TASKIDS_SOURCES = data[8];
STR_FILEIDS_SOURCES = data[9];
STR_SHEETNAMES_SOURCES = data[10];
STR_RANGES_SOURCES = data[11];
STR_SQL_SOURCES = data[12];
}