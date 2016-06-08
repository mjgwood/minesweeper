var minesweeper = (function() {
  var squares = [],
      mines = [];

  // Grid module
  var grid = {

    // Create grid according to numRows x numCols and fill squares array
    createGrid: function() {
      var numRows = 9,
          numCols = 9,
          toAdd = "";

      for ( var i = 0; i < numRows; i++ ) {
        toAdd += "<tr>";

        for ( var j = 0; j < numCols; j++ ) {
          squares.push( [i,j] );
          toAdd += "<td id=" + (i * numRows + j) + "></td>";
        }

        toAdd += "</tr>";
      }

      $("tbody").empty().append(toAdd);
      // loadMines();
      // displayTimer();
    },

    loadMines: function() {
      for ( var i = 0; i < 9; i ++ ) {
        col = Math.floor(Math.random() * (9 + 1));
        row = Math.floor(Math.random() * (9 + 1));
        mines.push([col,row]);
      }

      displayMines();
    },

    displayMines: function() {
      
    },

    // Take x & y values of a square and return square id
    findSquareId: function(i,j) {

    }
  };

  return {
    grid: grid
  };

})();

$(document).ready( function() {
  minesweeper.grid.createGrid();
});
