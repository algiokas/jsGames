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
ctx_game.textAlign = "center";

var highlights = Array.from(Array(num_cells_x * num_cells_y), () => 0);

function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isDigit(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) 
    && (n > 0) && (n < 10) && (n == Math.floor(n));
}

function randInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function randomDigit() {
    return randInt(1, 9);
}

var appColors = (function() {
    return {
        text: "#FF0000",
        lightGray: "#D0D0D0",
        darkGray: "#A0A0A0",
    }
})();

//Wrapper module for storing/accessing numeric data in localStorage
var gameData = (function() {
    localStorage.clear();

    return {
        set: function(key, val) {
            localStorage.setItem(key.toString(), val.toString());
        },
        get: function(key) {
            return localStorage.getItem(key.toString())
        }
    }
})();

//Module that contains functions related to 
var board = (function() {
    
    var identity = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    //Get the 2d co-ordinates of a cell based on its 1d index
    function IgetCoordinates(idx) {
        return {
            row: Math.floor(idx / num_cells_x),
            col: idx % num_cells_x
        }
    };

    //Get the 1d index of a cell based on its co-ordinates
    function IgetIndex(x, y) {
        return x + (y * num_cells_x);
    }

    //Get the indices of all other cells in the same column as the cell at idx
    function getColIndices(idx) {
        let colNum = IgetCoordinates(idx).col;
        let i;
        let result = [];
        for (i = 0; i < num_cells_y; i++) {
            result.push(colNum + (i * num_cells_x));
        }
        return result;
    }

    //Get the indices of all other cells in the same row as the cell at idx
    function getRowIndices(idx) {
        let rowNum = IgetCoordinates(idx).row;
        let i;
        let result = [];
        for (i = 0; i < num_cells_x; i++) {
            result.push((rowNum * num_cells_x) + i);
        }
        return result;
    }

    //Get the indices of all other cells in the same 3x3 box as the cell at idx
    function getBoxIndices(idx) {
        let coords = IgetCoordinates(idx);
        let hThird = Math.floor(coords.col / 3);
        let vThird = Math.floor(coords.row / 3);

        let result = [];
        let i, j;
        for (j = vThird * 3; j < (vThird+1) * 3; j++) {
            for (i = hThird * 3; i < (hThird+1) * 3; i++) {
                result.push(IgetIndex(i, j));
            }
        }
        return result;
    }

    //(Internal) get the board co-ordinates of a cell based on its canvas co-ordinates
    function IgetCellByPosition(x, y) {
        return {
            row: Math.floor(y / cellSize),
            col: Math.floor(x / cellSize)
        }
    }

    //(Internal) get the canvas co-ordinates of the center point of the cell at idx
    function  IgetCellCenter(idx) {
        let cellCoords = IgetCoordinates(idx);
        return {
            x: (cellSize / 2) + (cellSize * cellCoords.col),
            y: (cellSize / 1.5) + (cellSize * cellCoords.row)
        }
    }

    //(Internal) get the canvas co-ordinates of the top left point of the cell at idx
    function IgetCellTopLeft(idx) {
        let cellCoords = IgetCoordinates(idx);
        return {
            x: (cellSize * cellCoords.col),
            y: (cellSize * cellCoords.row)
        }
    }

    //(Internal) get the entire neighborhood (row, column, and box) of a cell
    //In sudoku, each cell must have a value different than every other cell in its neighborhood
    function IgetNeighborhood(idx) {
        let result = getColIndices(idx);
        result = result.concat(getBoxIndices(idx));
        result = result.concat(getRowIndices(idx));
        return result;
    }

    //(Internal) returns a set containing ethe values in the neighborhood of a cell with no duplicates
    function IgetNeighborhoodVals(idx) {
        let neighborhood = IgetNeighborhood(idx);
        let result = new Set([]);
        neighborhood.forEach(function(idx) {
            let val = gameData.get(idx);
            if (val > 0) {
                result.add(Number(val));
            }
        });
        return result;
    }

    
    //Generates a random permutation of digits using a knuth shuffle
    function randomPermutation() {
        let result = [];
        let idCopy = identity.slice();
        let whichElement;
        while(idCopy.length > 0) {
            whichElement = Math.floor(Math.random() * idCopy.length - 0.5);
            result.push(Number(idCopy.splice(whichElement, 1)));
        }
        console.log(result);
        return result;
    }

    function searchAndSwap(arr, startIndex, isValid) {
        let i;
        let end = arr.slice(startIndex);
        for (i = 0; i < end.length; i++) {

        }
    }

    function randomPConstrained(row) {
        let i, cellIdx, end, validDigits, nVals, whichElement;
        let result = randomPermutation();
        for (i = 0; i < num_cells_x; i++) { //iterating over a row
            cellIdx = IgetIndex(i, row); //get the cell index for each cell in the row
            end = result.slice(i);
            nVals = IgetNeighborhoodVals(cellIdx); //check which digits are present in the neighborhood of the cell
            validDigits = idCopy.filter(x => !(nVals.has(x) || result.has(x))); //get an array of digits that are _not_ present in the neighborhood

            whichElement = randInt(0, validDigits.length - 1); //pick a random element from the list of valid elements
            result.add(validDigits[whichElement]); //add that randomly chosen element to the row
        }
        console.log(Array.from(result));
        return Array.from(result);
    }

    function fillBoard() {
        let i, j;
        let row;
        for (i = 0; i < num_cells_y; i++) {
            row = ((i < 1) ? randomPermutation() : randomPConstrained(i));
            for (j = 0; j < num_cells_x; j++) {
                gameData.set(j + (num_cells_x * i), row[j]);
            }
        }
    }
    
    fillBoard();


    return {
        getCoordinates: function(idx) {
            return IgetCoordinates(idx);
        },
    
        getIndex: function(x, y) {
            return IgetIndex(x, y);
        },
        //Public interface for IgetCellByPosition()
        getCellByPosition: function(x, y) {
            return IgetCellByPosition(x, y);
        },

        //Public interface for IgetCellCenter()
        getCellCenter: function(idx) {
            return IgetCellCenter(idx);
        },

        getCellTopLeft: function(idx) {
            return IgetCellTopLeft(idx);
        },

        //Public interface for IgetNeighborhood()
        getNeighborhood: function(idx) {
            return IgetNeighborhood(idx);
        },

        //Public interface for IgetNeighborhoodVals()
        getNeighborhoodVals: function(idx) {
            return IgetNeighborhoodVals(idx);
        }

    }
})();

var game = (function() {

    return {
        getCell: function(row, col) {
            let cellNum = col + (num_cells_x * row);
            let cellVal = gameData.get(cellNum);
            return Number(cellVal);
        },

        setCell: function(row, col, val) {
            let cellNum = col + (num_cells_x * row);
            gameData.set(cellNum, val);
        },
    }
})();

var render = (function() {
    function drawBoard() {
        let i;
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

    function highlightCell(idx, color) {
        let topLeft = board.getCellTopLeft(idx);
        ctx_game.fillStyle = color;
        ctx_game.fillRect(topLeft.x, topLeft.y, cellSize, cellSize);
    }

    function drawNumber(idx, val) {
        let center = board.getCellCenter(idx);
        ctx_game.fillStyle = appColors.text;
        ctx_game.fillText(val, center.x, center.y);
    }

    return {


        updateView: function() {
            let i;
            let cellVal;
            ctx_game.clearRect(0, 0, board_width, board_height);
            for (i=0; i<num_cells_x * num_cells_y; i++) {
                cellVal = gameData.get(i)
                if (highlights[i] > 0) {
                    highlightCell(i, (highlights[i] == 2) ? appColors.darkGray : appColors.lightGray);
                }
                if (Number(cellVal) > 0) {
                    drawNumber(i, cellVal);
                }
            }
        }
    }
})();

render.updateView();

canvas_static.addEventListener('click', event => {
    let mousePos = getMousePos(canvas_static, event);
    let mouseCoords = board.getCellByPosition(mousePos.x, mousePos.y);
    let mouseIdx = board.getIndex(mouseCoords.col, mouseCoords.row)
    let n = board.getNeighborhood(mouseIdx);
    n.forEach(function(cell) {
        highlights[cell] = 1;
    });
    highlights[mouseIdx] = 2;
    render.updateView();
    let currentVal = gameData.get(mouseIdx);

    let input = prompt("Enter value for cell (" + mouseCoords.row + ", " + mouseCoords.col + ") current value: " + currentVal, "1-9");
    if (isDigit(input)) {
        gameData.set(mouseIdx, input);
    } else {
        alert("Invalid input");
    }
    render.updateView();
    highlights.fill(0);
});

window.addEventListener("keyup", event => {
    alert(event.keyCode);
});



