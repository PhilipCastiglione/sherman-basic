$(document).ready(function() {

  // set tile set
  var tile = {
    B: '<div class="blank"></div>',
    W: '<div class="wall"></div>',
    O: '<div class="obstacle"></div>',
    G: '<div class="goal"></div>',
    P: '<div class="player"></div>',
    T: '<div class="thing"></div>'
  };

  // set board
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

  function renderBoard() {
    var $board = $('<div id="board">');
    // for each row
    _.each(board.tiles, function(row, rowNum, list) {
      var $row = $('<div class="row">');
      // for each tile
      _.each(row, function(content, colNum, list2) {
        // display, if player
        if (rowNum + 1 === board.playerTile.row &&
         colNum + 1 === board.playerTile.col) {
          $row.append($('<div class="tile">').html(tile['P']));
        // display, if thing
        } else if (rowNum + 1 === board.thingTile.row &&
         colNum + 1 === board.thingTile.col) {
          $row.append($('<div class="tile">').html(tile['T']));
        // display, if goal
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

  function moveItem(direction, boardItem) {
    // points to item tile location
    var itemTile = board[boardItem];

    // returns current type of destination tile - N means none
    function setDestinationTile(rowOffset, colOffset) {
      try {
        var tile = board.tiles[itemTile.row - rowOffset][itemTile.col - colOffset] || 'N';
      } catch(e) {
        var tile = 'N';
      }
      return tile;
    }

    // check if the move is valid
    function canMove(limitingEdge, limitingVal) {
      if (itemTile[limitingEdge] !== limitingVal &&
         destinationTile !== 'W') {
        if (boardItem !== 'thingTile' ||
          destinationTile !== 'O') {
          return true;
        }
      }
      return false;
    }

    // for arrow keys: set destination tile, check validity, move if valid then increment move count
    switch(direction) {
    case 37: // left
      var destinationTile = setDestinationTile(1, 2);
      if (canMove('col', 1)) itemTile.col--;
      if (boardItem === 'playerTile') incrementMoves();
      break;
    case 38: // up
      var destinationTile = setDestinationTile(2, 1);
      if (canMove('row', 1)) itemTile.row--;
      if (boardItem === 'playerTile') incrementMoves();
      break;
    case 39: // right
      var destinationTile = setDestinationTile(1, 0);
      if (canMove('col', board.numTiles)) itemTile.col++;
      if (boardItem === 'playerTile') incrementMoves();
      break;
    case 40: // down
      var destinationTile = setDestinationTile(0, 1);
      if (canMove('row', board.numTiles)) itemTile.row++;
      if (boardItem === 'playerTile') incrementMoves();
      break;
    default:
      break;
    }
  }

  // checks if location of two board items is the same
  function compare(boardItem1, boardItem2) {
    return (board[boardItem1].row === board[boardItem2].row &&
      board[boardItem1].col === board[boardItem2].col)
  }

  // on win, displays message, stops game and checks for new best score
  function checkWin() {
    if (compare('thingTile','goalTile')) {
      $('body').append($('<h1>').text('you win'));
      $(document).off('keyup', runMove);
      checkNewBestScore();
    }
  }

  // checks new best score and sets if valid
  function checkNewBestScore() {
    if (parseInt($('#moves').text(),10) < parseInt(localStorage.getItem('bestScore'),10)) {
      localStorage.setItem('bestScore', parseInt($('#moves').text(),10));
      $('#best').text(localStorage.getItem('bestScore'));
    }
  }

  // increments the current move counter and displays
  function incrementMoves() {
    var count = parseInt($('#moves').text(),10);
    $('#moves').text(++count);
  }

  // run move on event
  function runMove() {
    // move player
    moveItem(event.which, 'playerTile');
    // if push
    if (compare('playerTile', 'thingTile')) {
      // move thing
      moveItem(event.which, 'thingTile');
      // if thing didn't move (ie. wall or object obstructs)
      if (compare('playerTile', 'thingTile')) {
        var direction = (event.which - 35) % 4 + 37; // reverses direction
        // leave player and put thing where player was (ie. swap positions)
        moveItem(direction, 'thingTile');
        // if thing still didn't move
        if (compare('playerTile', 'thingTile')) {
          // swap was invalid, return player to starting position
          moveItem(direction, 'playerTile');
        }
      }
    }
    checkWin();
    renderBoard();
  }

  // if first time user and no best score, set to 100
  if (localStorage.getItem('bestScore') === null) {
    localStorage.setItem('bestScore', 100);
  }
  // put best score to screen
  $('#best').text(localStorage.getItem('bestScore'));
  // initial board render
  renderBoard();
  // establish event listener
  $(document).on('keyup', runMove);

});