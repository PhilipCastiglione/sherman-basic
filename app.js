$(document).ready(function() {

  var board = {
    numTiles: 6,
    tiles: [['B','B','W','B','B','B'],['B','B','W','B','W','B'],['W','B','W','B','W','B'],['W','B','W','B','O','B'],['B','B','B','B','B','W'],['O','B','W','B','B','W']],
    playerTile: {
      row: 1,
      col: 1
    },
    thingTile: {
      row: 1,
      col: 2
    },
    goalTile: {
      row: 4,
      col: 6
    }
  };

  var tile = {
    B: '<div class="blank"></div>',
    W: '<div class="wall"></div>',
    O: '<div class="obstacle"></div>',
    G: '<div class="goal"></div>',
    P: '<div class="player"></div>',
    T: '<div class="thing"></div>'
  };

  function compare(boardProperty1, boardProperty2) {
    return (board[boardProperty1].row === board[boardProperty2].row &&
      board[boardProperty1].col === board[boardProperty2].col)
  }

  function renderBoard() {
    var $board = $('<div id="board">');
    // for each row
    _.each(board.tiles, function(row, rowNum, list) {
      var $row = $('<div class="row">');
      // for each tile
      _.each(row, function(content, colNum, list2) {
        // display if player
        if (rowNum + 1 === board.playerTile.row &&
         colNum + 1 === board.playerTile.col) {
          $row.append($('<div class="tile">').html(tile['P']));
        // display if thing
        } else if (rowNum + 1 === board.thingTile.row &&
         colNum + 1 === board.thingTile.col) {
          $row.append($('<div class="tile">').html(tile['T']));
        // display if goal
        } else if (rowNum + 1 === board.goalTile.row &&
         colNum + 1 === board.goalTile.col) {
          $row.append($('<div class="tile">').html(tile['G']));
        // or display the base tile
        } else {
          $row.append($('<div class="tile">').html(tile[content]));
        }
      });
      // append each row to board
      $board.append($row);
    });
    // render board to DOM
    $('#board-wrapper').html($board);
  }

  function moveItem(direction, boardProp) {
    var itemTile = board[boardProp];
    var destinationTile;
    switch(direction) {
    case 37: // left
      try {
        destinationTile = board.tiles[itemTile.row - 1][itemTile.col - 2];
      } catch(e) {
        destinationTile = 'N';
      }

      if (itemTile.col !== 1 &&
         destinationTile !== 'W') {
        if (boardProp !== 'thingTile' ||
          destinationTile !== 'O') {
          itemTile.col--;
        }
      }

      if (boardProp === 'playerTile') {
        incrementMoves();
      }

      break;
    case 38: // up
      try {
        destinationTile = board.tiles[itemTile.row - 2][itemTile.col - 1];
      } catch(e) {
        destinationTile = 'N';
      }
        
      if (itemTile.row !== 1 &&
        destinationTile !== 'W') {
        if (boardProp !== 'thingTile' ||
          destinationTile !== 'O') {
          itemTile.row--;
        }
      }
      
      if (boardProp === 'playerTile') {
        incrementMoves();
      }

      break;
    case 39: // right
      try {
        destinationTile = board.tiles[itemTile.row - 1][itemTile.col];
      } catch(e) {
        destinationTile = 'N';
      }

      if (itemTile.col !== board.numTiles &&
         destinationTile !== 'W') {
        if (boardProp !== 'thingTile' ||
          destinationTile !== 'O') {
          itemTile.col++;
        }
      }
      
      if (boardProp === 'playerTile') {
        incrementMoves();
      }
        
      break;
    case 40: // down
      try {
        destinationTile = board.tiles[itemTile.row][itemTile.col - 1];
      } catch(e) {
        destinationTile = 'N';
      }

      if (itemTile.row !== board.numTiles &&
        destinationTile !== 'W') {
        if (boardProp !== 'thingTile' ||
          destinationTile !== 'O') {
          itemTile.row++;
        }
      }
      
      if (boardProp === 'playerTile') {
        incrementMoves();
      }

      break;
    default:
      break;
    }
  }

  function checkWin() {
    if (compare('thingTile','goalTile')) {
      var $h1 = $('<h1>').text('you win');
      $('body').append($h1);
      $(document).off('keyup', runMove);

      if (parseInt($('#moves').text(),10) < parseInt(localStorage.getItem('bestScore'),10)) {
        localStorage.setItem('bestScore', parseInt($('#moves').text(),10));
        $('#best').text(localStorage.getItem('bestScore'));
      }
    }
  }

  function incrementMoves() {
    var count = parseInt($('#moves').text(),10);
    $('#moves').text(++count);
  }

  function runMove() {
    moveItem(event.which, 'playerTile');
    if (compare('playerTile', 'thingTile')) {
      moveItem(event.which, 'thingTile');
      if (compare('playerTile', 'thingTile')) {
        var direction = (event.which - 35) % 4 + 37; // reverses direction
        moveItem(direction, 'thingTile');
        if (compare('playerTile', 'thingTile')) {
          moveItem(direction, 'playerTile');
        }
      }
    }
    checkWin();
    renderBoard();
  }


  if (localStorage.getItem('bestScore') === null) {
    localStorage.setItem('bestScore', 100);
  }
  $('#best').text(localStorage.getItem('bestScore'));
  renderBoard();
  $(document).on('keyup', runMove);

});