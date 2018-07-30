function getResultFromRequset_(dataSets, sqlText) {
  // left(sqlText, 6) == "select"
  if (getTextStartsWith_(sqlText, 'select')) { return getAlaSqlResult_(dataSets, sqlText); }
  
  // left(sqlText, 3) = 'Col'
  if (getTextStartsWith_(sqlText, 'Col')) { return getJoinedTables_(dataSets, sqlText); }
  
  // else
  return [];
  
}


function test_getTextStartsWith()
{  
  Logger.log(getTextStartsWith_('SeLecT * from ?', 'select'));    // true
  Logger.log(getTextStartsWith_('SeLecT * from ?', 'select', 1)); // false
  Logger.log(getTextStartsWith_('SeLecT * from ?', 'seelect'));   // false
}
function getTextStartsWith_(text, check, caseSensitive)
{
  caseSensitive = caseSensitive || 0;
  
  var searchMarker = '';
  if (!caseSensitive) { searchMarker = 'i'; }
  
  var re = new RegExp("^" + check, searchMarker);
  
  return (text.match(re) !== null);  
}
