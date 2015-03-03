Array.prototype.shuffle = Array.prototype.shuffle || function () {
    var counter = this.length, temp, index;

    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;

        temp = this[counter];
        this[counter] = this[index];
        this[index] = temp;
    }
};

var Tile = function (el, position, puzzle) {
    this.el = el;
    this.bindEvents();
    this.x = position.x;
    this.y = position.y;
    this.puzzle = puzzle;
    this.text = this.el.innerHTML;
};

Tile.prototype = {
    bindEvents: function () {
        var that = this;

        this.el.addEventListener("click", function () {
            that.puzzle.swapTile(that);
        });
    },

    position: function () {
        this.el.style.left = (this.x * 100) + 10 + "px";
        this.el.style.top = (this.y * 100) + 10 + "px";
    }
};

var Puzzle = function (el) {
    this.el = el;
    this.tiles = [];
    this.initTiles();
};

Puzzle.prototype = {
    initTiles: function () {
        var tileElements = this.el.getElementsByClassName("tile"),
            that = this,
            positions = this.getPositions(),
            counter = 0;

        Array.prototype.forEach.call(tileElements, function (element) {
            var tile = new Tile(element, positions[counter], that);

            that.tiles.push(tile);

            if (tile.text === " ") {
                that.blankTile = tile;
            }

            counter++;
        }, tileElements);

        this.position();
    },

    getPositions: function () {
        var positions = [];

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                positions.push({
                    x: j,
                    y: i
                });
            }
        }

        positions.shuffle();

        return positions;
    },

    position: function () {
        this.tiles.forEach(function (tile) {
            tile.position();
        });
    },

    swapTile: function (tile) {
        if (!this.isEligibleForSwap(tile)) {
            return;
        }

        if (this.won) {
            return;
        }

        var blankX = this.blankTile.x;
        var blankY = this.blankTile.y;

        this.blankTile.x = tile.x;
        this.blankTile.y = tile.y;

        tile.x = blankX;
        tile.y = blankY;

        this.blankTile.position();
        tile.position();

        this.checkForWin();
    },

    checkForWin: function () {
        if (this.isWon()) {
            this.el.className = this.el.className + " won";
        }
    },

    isWon: function () {
        var result = true;
        var counter = 0;

        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                if (this.tiles[counter].x !== x ||  this.tiles[counter].y !== y) {
                    result = false;
                }

                counter++;
            }
        }

        this.won = result;
        return result;
    },

    isEligibleForSwap: function (tile) {
        var xDifference = tile.x - this.blankTile.x,
            yDifference = tile.y - this.blankTile.y;

        if (tile === this.blankTile) {
            return false;
        }

        if ((xDifference < -1 || xDifference > 1) || (yDifference < -1 || yDifference > 1)){
            return false;
        }

        if (xDifference !== 0 && yDifference !== 0) {
            return false;
        }

        return true;
    }
};
