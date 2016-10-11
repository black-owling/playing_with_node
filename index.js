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

// create world
class World {
  constructor (options) {
    // size of world
    this.x = options.x;
    this.y = options.y;

    // closed world allows player to move from last cell to first
    // if he try to exceed world's dimension
    this.isClosed = options.isClosed;

    // generate world
    this.world = [];
    for (var y = 0; y < this.y; y++) {
    this.world[y] = [];
      for (var x = 0; x < this.x; x++ ) {
        this.world[y][x] = '□';
      }
    }
  }

  // render method
  render() {
    jetty.moveTo([2,0]);
    for (var y = 0; y < this.y; y++) {
      for (var x = 0; x < this.x; x++ ) {
        if (player.x == x && player.y == y) {
          // render player cell
          jetty.text('▣ ');
        } else {
          jetty.text(this.world[y][x] + ' ');
        }
      }
      jetty.text('\n');
    }
  }

}
var world = new World({
  x: 5,
  y: 5,
  isClosed: true,
});

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
    if (world.world[newY] == undefined) {
      if (world.isClosed) {
        // move from last to first
        if (this.y == world.y - 1) {
          newY = 0;
        // and from first to last
        } else {
          newY = world.y - 1;
        }
      } else {
        return;
      }
    } else if (world.world[newY][newX] == undefined) {
      if (world.isClosed) {
        if (this.x == world.x - 1) {
          newX = 0;
        } else {
          newX = world.x - 1;
        }
      } else {
        return;
      }
    }
    // if it is ok - move
    this.x = newX;
    this.y = newY;
    world.render();
  }
}

var player = new Creature({y:0, x:0});

// initial render
world.render();

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