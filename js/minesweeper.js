var minesweeper = (function() {

  // Grid module
  var grid = {

    inititialize: function() {
      this.squares = [];
      this.mines = [];
      this.createGrid();
    },

    // Create grid according to numRows x numCols and fill squares array
    createGrid: function() {
      var numRows = 9,
          numCols = 9,
          toAdd = "";

      for ( var i = 0; i < numRows; i++ ) {
        toAdd += "<tr>";

        for ( var j = 0; j < numCols; j++ ) {
          this.squares.push([i,j]);
          toAdd += "<td id=" + (i * numRows + j) + "></td>";
        }

        toAdd += "</tr>";
      }

      $("tbody").empty().append(toAdd);
      this.loadMines();
      // displayTimer();
    },

    // Generate unique random coords of mines, fill mines array, and call displayMines()
    loadMines: function() {
      var i = 0;

      while ( i < 10 ) {
        var row = Math.floor(Math.random() * 9);
        var col = Math.floor(Math.random() * 9);
        var dupeFound = false;

        for ( var j = 0; j < this.mines.length; j++ ) {
          if ( this.mines[j][0] === row && this.mines[j][1] === col ) {
            dupeFound = true;
          }
        }

        if ( dupeFound === false ) {
          this.mines.push([row, col]);
          i++;
        }
      }

      this.displayMines();
    },

    displayMines: function() {
      for ( var i = 0; i < this.mines.length; i++ ) {
        $("#" + this.getSquareId(this.mines[i])).addClass("mine");
      }
    },

    // Take x & y values of a square and return square id
    getSquareId: function(array) {
      return array[1] * 9 + array[0];
    }
  };

  return {
    grid: grid
  };

})();

$(document).ready( function() {
  minesweeper.grid.inititialize();
});
