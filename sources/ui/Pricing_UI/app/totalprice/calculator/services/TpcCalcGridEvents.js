/**
 * Created by atp1kkp on 7/28/2015.
 */

Grids.OnRightClickCell=function(grid, row, col,x,y,event){
  if(grid.id=='mainGrid' || grid.id == 'detailGrid') {
    grid.CloseDialog();
    if ((row.id != 'tpCalcMainToolBar' || row.id != 'tpCalcDetailToolBar') && row.id != 'ServerSideFilter' && row.id != 'AR1') {
      grid.Dialog = ShowPopup(returnMenu(grid, row, col));

    }
  }
  return true;
};

function returnMenu(grid,row, col){
  var selectedRows = grid.GetSelRows();


var M= {};

  if (grid.id == 'mainGrid') {

    M = {
      Items: [
        {Name: "mr", Text: "Move Rows to Detail Grid", Height: 20, Hidden: 0, Disabled: 0}

      ]
    }

  }
  else if (grid.id == 'detailGrid'){
    M = {
      Items: [
    { Name:"md", Text:"Move Rows to Main Grid", Height:20, Hidden:0, Disabled:0}
      ]
    }
  }


  M.OnSave = function(item){
    if(item.Name == 'mr')moveRowsToTarget(grid);
    if(item.Name == 'md')moveRowsToSource(grid);

  };
  return M;
}

function moveRowsFromSourceToTarget(sourceGrid,targetGrid){

  var rows = sourceGrid.GetSelRows();
  if (rows.length == 0){
    return;
  }
  else {
    for (i=0;i<rows.length;i++) {
      sourceGrid.MoveRowsToGrid(rows[i],targetGrid,null,1,false);
    }
    targetGrid.AcceptChanges();
    sourceGrid.AcceptChanges();
   }
}

function selectAllMainRows(){
  var grid = Grids['mainGrid'];
  grid.SelectAllRows(1);
}
function selectAllDetailRows(){
  var grid = Grids['detailGrid'];
  grid.SelectAllRows(1);
}

function ClearMainSelection(){
  var grid = Grids['mainGrid'];
  grid.SelectAllRows(0);
}

function ClearDetailSelection(){
  var grid = Grids['detailGrid'];
  grid.SelectAllRows(0);
}


function moveRowsToTarget(){
  var sourceGrid = Grids['mainGrid'];
  var targetGrid = Grids['detailGrid'];
  moveRowsFromSourceToTarget(sourceGrid,targetGrid);
  // alert('grid data after move' + targetGrid.Body);

}
function moveRowsToSource(){
  var sourceGrid = Grids['detailGrid'];
  var targetGrid = Grids['mainGrid'];
  moveRowsFromSourceToTarget(sourceGrid,targetGrid);
}



/*function gridOnGetFilterValue(grid,row,col,value){
  alert('value' + value);
  return value.substring(1,value.length);
}
Grids.OnFilter= function(grid, type){

 grid.Filter.fareclass='A';


};

Grids.OnGetFilterValue= function(grid, row, col, val){
 // alert('in on Get Filter value' + val);
}; */

function gridOnFareClassSearch(grid,row,col,value,menu){

 // if(value!= 'undefined' && value != null && value !='' && value!='-') {
    grid.DoSearch("Clear", 1);
    if (value.length > 0 && value.charAt(0)=='-'){
      grid.Filter.fareclassDefaultFilter = 11;
      value =value.substring(1,value.length);
    }
    else{
      grid.Filter.fareclassDefaultFilter = 7;
    }
    grid.SearchExpression =value;
      if(value == '') {
        grid.SearchAction = 'Clear';
        grid.SearchCols = 'fareclass';
        grid.DoSearch("Clear");
    }
    else {
        grid.SearchAction = 'Select';
        grid.SearchCols = 'fareclass';
        grid.DoSearch("Select");

    }
    grid.DoFilter(row,col);

 // }

};



/**
 * the event to filter by subscriberName
 */
function fareclassOnRowFilter(grid, row, show) {
  // alert(grid.id);
  /*if (grid.id == "mainGrid" || grid.id == "detailGrid") { */
     var R = grid.GetFixedRows();
     var marketFilterMatch = "";
     var cabinFilterMatch = "";
     var fareclassFilterRow="";
     for (var i = 0; i < R.length; i++) {
       var s = "", r = R[i];
       if (r.Kind != "Filter") continue;
       for (var col in grid.Cols) {
         if (col == 'market') {
           marketFilterMatch = grid.GetValue(r, 'market');
         }
         if(col == 'cabinType'){
           cabinFilterMatch = grid.GetValue(r, 'cabinType');
         }
       }
     }

  var marketFilterPresent = false;
  var cabinFilterPresent = false;
  var fareclassFilterPresent = false;

  if(marketFilterMatch != null && marketFilterMatch != '' && marketFilterMatch.length > 0) marketFilterPresent = true;
  if(cabinFilterMatch != null && cabinFilterMatch != '' && cabinFilterMatch.length > 0) cabinFilterPresent = true;
  if(grid.SearchExpression != null && grid.SearchExpression != '' && grid.SearchExpression.length > 0) fareclassFilterPresent = true;

   // match = grid.GetValue(fareclassFilterRow,'fareclass');*/

  var foundMarket = true;
  var foundCabin = true;
  var foundFc = true;


    // if (grid.ACol == 'market') {
        //grid.SetFilter(grid.ACol,grid.GetValue(row,grid.Cols[grid.ACol]),grid.Cols[grid.ACol],show,1);

           if(marketFilterPresent) {
             marketFilterMatch = marketFilterMatch.toLocaleUpperCase();
             var matchStrs = marketFilterMatch.split(';');
             var gridStr = grid.GetValue(row, 'market');
             foundMarket = filterByMarket(matchStrs, gridStr);
           }
           if(cabinFilterPresent){
             cabinFilterMatch=cabinFilterMatch.toLocaleUpperCase();
             var matchStrs = cabinFilterMatch.split(';');
             var gridStr = grid.GetValue(row, 'cabinType');
             foundCabin = filterByCabin(matchStrs,gridStr);
           }
           if(fareclassFilterPresent){
             foundFc = filterByFareclass(grid,row);
           }
  return (foundMarket && foundCabin && foundFc);
         //}

    /*   }


      if (grid.ACol == 'cabinType') {
      //grid.SetFilter(grid.ACol,grid.GetValue(row,grid.Cols[grid.ACol]),grid.Cols[grid.ACol],show,1);

      if(otherFilterMatch != null && otherFilterMatch != '' && otherFilterMatch.length > 0) {
        otherFilterMatch=otherFilterMatch.toLocaleUpperCase();
        var matchStrs = otherFilterMatch.split(';');
        var gridStr = grid.GetValue(row, grid.ACol);
        return filterByMarket(matchStrs,gridStr);

      }
      if (grid.ACol == 'fareclass') {

     }*/
};

function filterByMarket(matchStrs, gridStr){
  if(gridStr != null && gridStr != '' && gridStr.length > 0) {
    gridStr=gridStr.toLocaleUpperCase();
  }
  if (matchStrs.indexOf(gridStr) > -1) {
    return true;
  }
  else {
    return false;
  }
}

function filterByCabin(matchStrs, gridStr){
  if(gridStr != null && gridStr != '' && gridStr.length > 0) {
    gridStr=gridStr.toLocaleUpperCase();
  }
  if (matchStrs.indexOf(gridStr) > -1) {
    return true;
  }
  else {
    return false;
  }
}

function filterByFareclass(grid,row){
  match = grid.SearchExpression;

  if (match != null && match != '' && match.length > 0) {
    match = match.toUpperCase();


    grid.Filter.fareclassDefaultFilter = grid.Filter.fareclassDefaultFilter;

    if (grid.GetValue(row, 'fareclass') !== null && grid.GetValue(row, 'fareclass') !== '') {
      if (grid.Filter.fareclassDefaultFilter == 11 && grid.GetValue(row, 'fareclass').indexOf(match) > -1) {
        return true;
      }
      else if (grid.Filter.fareclassDefaultFilter == 7) {
        if (grid.GetValue(row, 'fareclass').slice(0, match.length) == match) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  //return true;
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length) == str;
  };
}




Grids.OnRowFilter = fareclassOnRowFilter;
//Grids.OnGetFilterValue = fareclassOnFilterValue;


