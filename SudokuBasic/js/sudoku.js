var cellSize = 60; //width and height of square board cell
var num_cells_x = 9;
var num_cells_y = 9;
var board_width = cellSize * num_cells_x;
var board_height = cellSize * num_cells_y;

var negMargin = "margin-left: -" + board_width/2 + "px"

var canvas_static = document.getElementById("game-board-static");
var ctx_static = canvas_static.getContext("2d");

canvas_static.setAttribute("width", board_width.toString());
canvas_static.setAttribute("height", board_height.toString());
canvas_static.setAttribute("style", negMargin);

var canvas_game = document.getElementById("game-state");
var ctx_game = canvas_game.getContext("2d");

canvas_game.setAttribute("width", board_width.toString());
canvas_game.setAttribute("height", board_height.toString());
canvas_game.setAttribute("style", negMargin);

ctx_game.font = "30px Comic Sans MS";
ctx_game.fillStyle = "red";
ctx_game.textAlign = "center";


function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

var gameData = (function() {
    return {
        set: function(key, val) {
            localStorage.setItem(key.toString(), val.toString());
        },
        get: function(key) {
            return localStorage.getItem(key.toString())
        }
    }
})();

var board = (function() {
    function drawBoard() {
        var i;
        ctx_static.strokeStyle = "black";
        for (i = 0; i <= num_cells_x; i++) {
            ctx_static.beginPath();
            ctx_static.moveTo(i * (board_width / num_cells_x), 0);
            ctx_static.lineTo(i * (board_width / num_cells_x), board_height);
            ctx_static.lineWidth = (i % 3 == 0) ? 3 : 1
            ctx_static.stroke();
        }
        for (i = 0; i <= num_cells_x; i++) {
            ctx_static.beginPath();
            ctx_static.moveTo(0, i * (board_width / num_cells_x));
            ctx_static.lineTo(board_height, i * (board_width / num_cells_x));
            ctx_static.lineWidth = (i % 3 == 0) ? 3 : 1
            ctx_static.stroke();
        }
    }

    drawBoard();

    return {
        getCellByPosition: function(x, y) {
            return {
                row: Math.floor(y / cellSize),
                col: Math.floor(x / cellSize)
            }
        },

        getCoordinates: function(idx) {
            return {
                row: Math.floor(idx / num_cells_x),
                col: idx % num_cells_x
            }
        },

        getCellCenter: function(idx) {
            var cellCoords = this.getCoordinates(idx);
            return {
                x: (cellSize / 2) + (cellSize * cellCoords.col),
                y: (cellSize / 1.5) + (cellSize * cellCoords.row)
            }
        }

    }
})();

var game = (function() {
    var identity = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    function randomPermutation() {
        let result = [];
        let temp = identity;
        console.log(temp);
        let whichElement;
        while(temp.length > 0) {
            whichElement = Math.floor(Math.random() * temp.length - 0.5);
            result.push(Number(temp.splice(whichElement, 1)));
        }
        return result;
    }
    var i;
    for(i = 0; i < num_cells_x * num_cells_y; i++) {
        gameData.set(i, Math.floor(Math.random()));
    }

    return {
        getCell: function(row, col) {
            var cellNum = col + (num_cells_x * row);
            var cellVal = gameData.get(cellNum);
            //console.log('Reading "' + cellVal + '" from storage location "' + cellNum + '"')
            return Number(cellVal);
        },

        setCell: function(row, col, val) {
            var cellNum = col + (num_cells_x * row);
            //console.log('Writing "' + val + '" to storage location "' + cellNum + '"')
            gameData.set(cellNum, val);
        },

        updateView: function() {
            var i;
            var cellVal;
            ctx_game.clearRect(0, 0, board_width, board_height);
            for (i=0; i<num_cells_x * num_cells_y; i++) {
                cellVal = gameData.get(i)
                if (Number(cellVal) > 0) {
                    var center = board.getCellCenter(i);
                    ctx_game.fillText(cellVal, center.x, center.y);
                }
            }
            console.log(randomPermutation());
        }
    }
})();

canvas_static.addEventListener('click', event => {
    var mousePos = getMousePos(canvas_static, event);
    var mouseCoords = board.getCellByPosition(mousePos.x, mousePos.y);
    //console.log("(" + mousePos.x + ", " + mousePos.y + ") = (row: " + mouseCoords.row + ", col: " + mouseCoords.col + ")");
    var currentVal = game.getCell(mouseCoords.row, mouseCoords.col);

    var inputNum = prompt("Enter value for cell (" + mouseCoords.row + ", " + mouseCoords.col + ") current value: " + currentVal, "1-9");
    game.setCell(mouseCoords.row, mouseCoords.col, inputNum);
    game.updateView();
});

window.addEventListener("keyup", event => {
    alert(event.keyCode);
});



