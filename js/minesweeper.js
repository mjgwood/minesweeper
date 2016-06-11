var minesweeper = (function() {
  var setup = {
    mines: 10,
    width: 9,
    height: 9
  }

  var CONDITION = {
    unclicked: 0,
    clicked: 1,
    flagged: 2
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
      toAdd = [ this.coords[0] + directions[dir][0], this.coords[1] +
      directions[dir][1] ];

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
      this.minesLeft = setup.mines;
      this.squaresLeft = setup.width * setup.height - setup.mines;
      this.createGrid();
    },

    // Create grid according to numRows x numCols and fill squares array
    createGrid: function() {
      var toAdd = "";

      for ( var i = 0; i < this.numRows; i++ ) {
        toAdd += "<tr>";

        for ( var j = 0; j < this.numCols; j++ ) {
          this.squares.push( new Square( [i,j] ) );
          toAdd += "<td id=" + (i * this.numCols + j) + "></td>";
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
        var row = Math.floor(Math.random() * this.numRows),
            col = Math.floor(Math.random() * this.numCols),
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
        $("#" + this.getSquareId(this.mines[i]));
      }
    },

    // Handle how to display square and call displaySquares() if necessary
    displaySquare: function(id) {
      var square = this.squares[id],
          touchingMines = square.numOfTouchingMines;

      if ( this.squares[id].hasMine ) {
        this.endGame(0);
      } else if ( touchingMines === 0 ) {
        this.displaySquares(id);
        //$("#" + id).css("background-color","#B3E2B3");
      } else {
        this.revealSquare(square, CONDITION.clicked);
      }
    },

    // Display nearby squares until squares that are touching mines are shown
    displaySquares: function(id) {
      var square = this.squares[id],
          nextSquare,
          touchingSquares,
          added = [id],
          toDisplay = [id];

      while ( toDisplay.length > 0 ) {
        nextSquare = this.squares[ toDisplay.shift() ];

        if ( nextSquare.numOfTouchingMines === 0 ) {
          touchingSquares = nextSquare.getTouchingSquares();

          $.each( touchingSquares, function( i, touching ) {
            if ( added.indexOf(touching) === -1 ) {
              added.push( touching );
              toDisplay.push( touching );
            }
          });
        }

        if ( nextSquare.condition === CONDITION.unclicked ) {
          this.revealSquare(nextSquare, CONDITION.clicked);
        }
      }
    },

    // Update html to show either blank or number of mines touching
    revealSquare: function(square, newCondition) {
      square.condition = newCondition;
      $("#" + square.id).css("background-color","#B3E2B3")

      if ( square.numOfTouchingMines > 0 ) {
        $("#" + square.id).text(square.numOfTouchingMines);
      }

      this.squaresLeft--;
      if ( this.squaresLeft === 0 ) {
        this.endGame(1);
      }
    },

    // End game and reveal all squares if win or just mines if lose
    endGame: function(end) {
      if ( end === 1 ) {
        this.displayMines(1);
        alert("You Win!");
      } else {
        this.displayMines(0);
        alert("Game Over :(");
      }
    },

    // End game and reveal all flags if win or mines if lose
    displayMines: function(end) {
      var toAdd;

      if ( end === 1 ) {
        toAdd = "<img class='flag-mine' src='img/flag.gif'/>";
      } else {
        toAdd = "<img class='flag-mine' src='img/mine.gif'/>";
      }

      $.each( this.mines, function( i, mine ) {
        var id = minesweeper.grid.getSquareId(mine);
        $("#" + id).html(toAdd);
      });
    },

    // Increases or decreases minesLeft by 1 and updates html mine counter
    updateMineCounter: function(i) {
      if ( i === 0 ) {
        this.minesLeft--;
      } else {
        this.minesLeft++;
      }

      $("#mines-left").text(this.minesLeft);
    },

    // Take x & y values of a square and return square id
    getSquareId: function(array) {
      return array[0] * this.numCols + array[1];
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

    // Handles left and right click conditions
    handleClick: function(click, id) {
      var square = this.squares[id];
      if ( click === 1 ) {
        switch (square.condition) {
          case CONDITION.unclicked:
            this.displaySquare(id);
            break;
          case CONDITION.clicked:
          case CONDITION.flagged:
            break;
          default:
        }
      } else if ( click === 3 ) {
        switch (square.condition) {
          case CONDITION.unclicked:
            square.condition = CONDITION.flagged;
            $("#" + id).html("<img class='flag-mine' src='img/flag.gif'/>");
            this.updateMineCounter(0);
            break;
          case CONDITION.clicked:
            break;
          case CONDITION.flagged:
            square.condition = CONDITION.unclicked;
            $("#" + id).html("");
            this.updateMineCounter(1);
            break;
          default:

        }
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
    // var touching = minesweeper.grid.squares[id].getTouchingSquares();
    // alert(id + " + " + touching);
    minesweeper.grid.handleClick(e.which, id);
  })

});
