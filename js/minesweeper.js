var minesweeper = (function() {

  // Grid module
  var grid = {

    inititialize: function() {
      this.squares = [];
      this.mines = [];
      this.numMines = 10;
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

    // Generate unique random coords of mines, fill mines array, and add mine class
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

      for ( var i = 0; i < this.mines.length; i++ ) {
        $("#" + this.getSquareId(this.mines[i])).addClass("mine");
      }
    },

    // Take a square's id and display it's details
    displaySquare: function(id) {
      var touchingMines = this.getNumOfTouchingMines(id);

      if ( $("#" + id).hasClass("mine") ) {
        //minesweeper.grid.displayAllSquares();
      } else if ( touchingMines === 0 ) {
        $("#" + id).css("background-color","#B3E2B3");
      } else if ( !$("#" + id).hasClass("mine") ) {
        $("#" + id).text(touchingMines);
      }
    },

    // Display details of all squares
    displayAllSquares: function() {
      for ( var i = 0; i < this.squares.length; i++ ) {
        var touchingMines = this.getNumOfTouchingMines(this.squares[i]);

        if ( $("#" + this.squares[i]).hasClass("mine") ) {
          $("#" + this.squares[i]).html("<img class='flag-mine' src='img/mine.gif'/>");
        } else if ( this.squares[i] === 0 ) {
          $("#" + this.square[i]).css("background-color","#B3E2B3");
        } else if ( !$("#" + this.squares[i]).hasClass("mine") ) {
          $("#" + this.squares[i]).text(touchingMines);
        }
      }
    },

    // Take x & y values of a square and return square id
    getSquareId: function(array) {
      return array[1] * 9 + array[0];
    },

    // Take id of a square and return array with ids of touching squares
    getTouchingSquares: function(id) {
      var touching = [];

      if ( id === 0 || id % 9 === 0 ) {
        touching.push((id - 9), (id - 9 + 1), (id + 1), (id + 9), (id + 9 + 1));
      } else if ( id - 9 < 0 ) {
        touching.push((id - 1), (id + 1), (id + 9 - 1), (id + 9), (id + 9 + 1));
      } else if ( id % 9 - 8 === 0 ) {
        touching.push((id - 9 - 1), (id - 9), (id - 1), (id + 9 - 1), (id + 9));
      } else if ( id + 9 >= 81 ) {
        touching.push((id - 9 - 1), (id - 9), (id - 9 + 1), (id - 1), (id + 1));
      } else {
        touching.push((id - 9 - 1), (id - 9), (id - 9 + 1), (id - 1), (id + 1), (id + 9 - 1), (id + 9), (id + 9 + 1));
      }

      return touching;
    },

    // Take square id and return number of touching mines
    getNumOfTouchingMines: function(id) {
      var touchingSquares = this.getTouchingSquares(id);
      var touchingMines = 0;

      for ( var i = 0; i < touchingSquares.length; i++ ) {
        if ( $("#" + touchingSquares[i]).hasClass("mine") ) {
          touchingMines++;
        }
      }

      return touchingMines;
    }
  };

  return {
    grid: grid
  };

})();

$(document).ready( function() {
  minesweeper.grid.inititialize();

  $("td").on("click", function() {
    var id = parseInt($(this).attr("id"));
    minesweeper.grid.displaySquare(id);
  })

});
