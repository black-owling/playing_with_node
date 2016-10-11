"use strict";
var Jetty = require('jetty');
var Keypress = require('keypress');

var jetty = new Jetty(process.stdout);
Keypress(process.stdin);

/*===================================
  Initialization
===================================*/
jetty.clear()
    .moveTo([0,0])
    .text('Array runner \n')
    .text('Use arrows to move or Ctrl+C to exit. \n');

// create game field
var gameFieldWidth = 5;
var gameFieldHeight = 5;

var gameField = [];
for (var y = 0; y < gameFieldHeight; y++) {
  gameField[y] = [];
  for (var x = 0; x < gameFieldWidth; x++ ) {
    gameField[y][x] = '□';
  }
}

// create player
class Creature {
  constructor (coords) {
    this.x = coords.x;
    this.y = coords.y;
  }

  move (newCoords) {
    var newX = newCoords.x;
    var newY = newCoords.y;
    // check if we can move to new coords
    if (gameField[newY] == undefined || gameField[newY][newX] == undefined) {
      //jetty.text('cannot move');
      return;
    }
    // if it is ok - move
    this.x = newX;
    this.y = newY;
    render();
  }
}

var player = new Creature({y:0, x:0});
render();

/*===================================
  Player Controls
===================================*/
process.stdin.on('keypress', function(ch, key) {
  // handle arrow keys
  switch (key.name) {
    case 'up':
      player.move({
        x: player.x,
        y: player.y - 1
      });
      break;
    case 'down':
      player.move({
        x: player.x,
        y: player.y + 1
      });
      break;
    case 'left':
      player.move({
        x: player.x - 1,
        y: player.y
      });
      break;
    case 'right':
      player.move({
        x: player.x + 1,
        y: player.y
      });
      break;
  }

  // exit
  if (key && key.ctrl && key.name == 'c') {
    process.exit();
  }
});
process.stdin.setRawMode(true);
process.stdin.resume();

/*===================================
  Rendering
===================================*/
function render() {
  jetty.moveTo([2,0]);
  for (var y = 0; y < gameFieldHeight; y++) {
    for (var x = 0; x < gameFieldWidth; x++ ) {
      if (player.x == x && player.y == y) {
        // render player cell
        jetty.text('▣ ');
      } else {
        jetty.text(gameField[y][x] + ' ');
      }
    }
    jetty.text('\n');
  }
}
