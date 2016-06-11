var minesweeper = (function() {
  var setup = {
    mines: 10,
    width: 9,
    height: 9
  }

  var CONDITION = {
    unclicked: 0,
    clicked: 1,
    flag: 2
  }

  function Square( coords ) {
    this.coords = coords;
    this.id = grid.getSquareId(this.coords);
    this.condition = CONDITION.unclicked;
    this.numOfTouchingMines = 0;
    this.hasMine = false;
  }

  // Return array with ids of touching squares
  Square.prototype.getTouchingSquares = function() {
    var touching = [],
      toAdd,
      directions = {
        upleft: [-1, -1],
        up: [-1, 0],
        upright: [-1, 1],
        left: [0, -1],
        right: [0, 1],
        downleft: [1, -1],
        down: [1, 0],
        downright: [1, 1]
      };

    for ( var dir in directions ) {
      toAdd = [ this.coords[1] + directions[dir][1], this.coords[0] + directions[dir][0] ];

      if ( isValidPosition(toAdd) ) {
        touching.push( grid.getSquareId(toAdd));
      }
    }

    return touching;
  };

  var isValidPosition = function( position ) {
    return position[0] >= 0 && position[0] < setup.width &&
           position[1] >= 0 && position[1] < setup.height;
  };

  // Grid module
  var grid = {

    inititialize: function() {
      this.numCols = setup.width;
      this.numRows = setup.height;
      this.squares = [];
      this.mines = [];
      this.numMines = setup.mines;
      this.createGrid();
    },

    // Create grid according to numRows x numCols and fill squares array
    createGrid: function() {
      var toAdd = "";

      for ( var i = 0; i < this.numRows; i++ ) {
        toAdd += "<tr>";

        for ( var j = 0; j < this.numCols; j++ ) {
          this.squares.push( new Square( [i,j] ) );
          toAdd += "<td id=" + (i * this.numRows + j) + "></td>";
        }

        toAdd += "</tr>";
      }

      $("tbody").empty().append(toAdd);
      this.loadMines();
      // displayTimer();
    },

    // Generate random mines, fill mines array, and update relevant Square info
    loadMines: function() {
      var i = 0;

      while ( i < 10 ) {
        var row = Math.floor(Math.random() * 9),
            col = Math.floor(Math.random() * 9),
            dupeFound = false,
            square = this.squares[this.getSquareId([row,col])],
            touchingSquares;

        for ( var j = 0; j < this.mines.length; j++ ) {
          if ( this.mines[j][0] === row && this.mines[j][1] === col ) {
            dupeFound = true;
          }
        }

        if ( dupeFound === false ) {
          square.hasMine = true;
          touchingSquares = square.getTouchingSquares();
          this.mines.push([row, col]);
          i++;

          for ( var j = 0; j < touchingSquares.length; j++ ) {
            this.squares[touchingSquares[j]].numOfTouchingMines += 1;
          }
        }
      }

      for ( var i = 0; i < this.mines.length; i++ ) {
        $("#" + this.getSquareId(this.mines[i])).addClass("mine");
      }
    },

    // Take a square's id and display it's details
    displaySquare: function(id) {
      var touchingMines = this.getNumOfTouchingMines(id);

      if ( this.squares[id].hasMine === true ) {
        //minesweeper.grid.displayAllSquares();
      } else if ( touchingMines === 0 ) {
        $("#" + id).css("background-color","#B3E2B3");
      } else if ( this.squares[id].hasMine === false ) {
        $("#" + id).css("background-color","#B3E2B3").text(touchingMines);
      }

      var touching = this.squares[id].touchingSquares;

      for ( var i = 0; i < touching.length; i++ ) {
        var touchingMines = this.squares[id].numOfTouchingMines;

        if ( touchingMines === 0 ) {
          this.displaySquare(touching[i]);
        }
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

    // Take square id and return number of touching mines
    getNumOfTouchingMines: function(coords) {
      var id = this.getSquareId(coords);
      var touchingSquares = this.squares[id].getTouchingSquares;
      var touchingMines = 0;

      for ( var i = 0; i < touchingSquares.length; i++ ) {
        if ( $("#" + touchingSquares[i]).hasClass("mine") ) {
          touchingMines++;
        }
      }

      return touchingMines;
    },

    handleClick: function(click, id) {
      var square = this.squares[id];
      if ( click === 1 ) {
        // switch (square) {
        //   case expression:
        //
        //     break;
        //   default:
        //
        // }
        var touchingSquares = minesweeper.grid.squares[id].getTouchingSquares();

        for ( var i = 0; i < touchingSquares.length; i++ ) {
          if ( minesweeper.grid.squares[touchingSquares[i]].hasMine === false ) {
            $("#" + touchingSquares[i]).css("background-color","#B3E2B3").text(minesweeper.grid.squares[touchingSquares[i]].numOfTouchingMines);
          }
        }
      } else if ( click === 3 ) {
        $("#" + id).html("<img class='flag-mine' src='img/flag.gif'/>");
      }
    }
  };

  return {
    grid: grid
  };

})();

$(document).ready( function() {
  minesweeper.grid.inititialize();

  $( "td" ).on( "contextmenu", function(e) {
    e.preventDefault();
  });

  $("td").mouseup( function(e) {
    var id = parseInt($(this).attr("id"));
    minesweeper.grid.handleClick(e.which, id);
  })

});
