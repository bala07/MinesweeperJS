var MAX_ROWS = 10;
var MAX_COLUMNS = 10;
var MAX_BOMBS = 15;
var BEGINNER_BOMBS = 7;
var INTERMEDIATE_BOMBS = 10;
var EXPERT_BOMBS = 15;


var init = function()
{
	attachEventsToLevelButtons();

	//document.getElementById("puzzle_board").setAttribute("hidden", "true");
}

var attachEventsToLevelButtons = function()
{
	var beginnerButton = document.getElementById("beginner");
	beginnerButton.onclick = generateBeginnerBoard;

	var intermediateButton = document.getElementById("intermediate");
	intermediateButton.onclick = generateIntermediateBoard;

	var expertButton = document.getElementById("expert");
	expertButton.onclick = generateExpertBoard;
}

var generateBeginnerBoard = function()
{
	generateBoard(BEGINNER_BOMBS);

	document.getElementById("rules").setAttribute("hidden", "true");
	//document.getElementById("puzzle_board").removeAttribute("hidden");
}

var generateIntermediateBoard = function()
{
	generateBoard(INTERMEDIATE_BOMBS);

	document.getElementById("rules").setAttribute("hidden", "true");
	//document.getElementById("puzzle_board").removeAttribute("hidden");
}

var generateExpertBoard = function()
{
	generateBoard(EXPERT_BOMBS);

	document.getElementById("rules").setAttribute("hidden", "true");
	//document.getElementById("puzzle_board").removeAttribute("hidden");
}

var generateBoard = function(bombsToPlace) 
{
	var table = document.createElement("table");
	table.setAttribute("class", "my_table")

	for(var i=0; i<MAX_ROWS; ++i)
	{
		var tableRow = document.createElement("tr");
		for(var j=0; j<MAX_COLUMNS; ++j)
		{
			
			var tableCell = getCell(i, j);
			var img = getImage();
			var div = getButton();

			tableCell.appendChild(img);
			tableCell.appendChild(div);

			tableRow.appendChild(tableCell);
		}
		table.appendChild(tableRow);
	}

	var puzzle_board = document.getElementById("puzzle_board");
	while(puzzle_board.childNodes.length > 0)
	{
		puzzle_board.removeChild(puzzle_board.firstChild);
	}

	puzzle_board.appendChild(table);

	placeBombs(bombsToPlace);
}

var placeBombs = function(bombsToPlace)
{
	var bombsPlaced = 0;
	while(bombsPlaced < bombsToPlace)
	{
		var row = Math.floor(Math.random() * 10);
		var column = Math.floor(Math.random() * 10);
		var cellId = getCellId(row, column);

		var cell = document.getElementById(cellId);
		if(cell.getAttribute("hasBomb") === "true")
		{
			continue;
		}

		var img = cell.firstChild;
		img.src = "images/Bomb.jpg"
		cell.setAttribute("hasBomb", "true");
		++bombsPlaced;

	}
}

var getCellId = function(row, column)
{
	return row + "_" + column;
}

var getButton = function() 
{
	var div = document.createElement("div");
	div.setAttribute("class", "button");
	div.onclick = onButtonClick;

	return div;
}

var getImage = function() 
{
	var img = document.createElement("img");
	img.src = "images/Empty.gif";
	img.setAttribute("hidden", "true");

	return img;
}

var getCell = function(row, col) 
{
	var tableCell = document.createElement("td");
	tableCell.setAttribute("id", row+"_"+col);
	tableCell.setAttribute("hasBomb", "false");
	tableCell.setAttribute("flag", "false");

	return tableCell;
}

var onButtonClick = function(event) 
{
	var button = event.currentTarget;
	var cell = button.parentNode;
	var img = cell.getElementsByTagName("img")[0];

	button.setAttribute("hidden", "true");
	img.removeAttribute("hidden");

	if(cell.getAttribute("hasBomb") === "true") 
	{
		explodeAllBombs();
		alert("Game over");
	}
	else
	{
		exploreCell(cell);
	}
}

var explodeAllBombs = function()
{
	for(var i=0; i<MAX_ROWS; ++i)
	{
		for(var j=0; j<MAX_COLUMNS; ++j)
		{
			var cell = document.getElementById(getCellId(i, j));
			var img = cell.getElementsByTagName("img")[0];
			var button = cell.getElementsByTagName("div")[0];

			if(cell.getAttribute("hasBomb") === "true")
			{
				button.setAttribute("hidden", "true");
				img.removeAttribute("hidden");
			}	
		}
	}
}

var exploreCell = function(sourceCell)
{
	var queue = [];
	queue.push(sourceCell);
	sourceCell.setAttribute("flag", "true");

	while(queue.length > 0)
	{
		var curCell = queue.shift();
		var img = curCell.getElementsByTagName("img")[0];
		var div = curCell.getElementsByTagName("div")[0];

		var row = parseInt(curCell.id.charAt(0));
		var col = parseInt(curCell.id.charAt(2));

		var surroundingBombs = countAdjacentBombs(row, col);

		
		img.src = getImageForNumber(surroundingBombs);
		div.setAttribute("hidden", "true");
		img.removeAttribute("hidden");

		if(surroundingBombs === 0)
		{
			for(var i=-1; i<=1; ++i)
			{
				for(var j=-1; j<=1; ++j)
				{
					if( i === 0 && j === 0 )
					{
						continue;
					}

					var newRow = row + i;
					var newCol = col + j;
					if(outOfBounds(newRow, newCol))
					{
						continue;
					}

					var newCell = document.getElementById(getCellId(newRow, newCol));
					if(newCell.getAttribute("flag") === "false")
					{
						newCell.setAttribute("flag", "true");
						queue.push(newCell);
					}
				}
			}


		}
	}
}

var outOfBounds = function(row, col) 
{
	return (row < 0 || row >= MAX_ROWS || col < 0 || col >= MAX_COLUMNS)
}

var countAdjacentBombs = function(row, col)
{
	var adjacentBombs = 0;
	for(var i=-1; i<=1; ++i)
	{
		for(var j=-1; j<=1; ++j)
		{
			if( i === 0 && j === 0 )
			{
				continue;
			}

			var newRow = row + i;
			var newCol = col + j;
			if(outOfBounds(newRow, newCol))
			{
				continue;
			}

			var cell = document.getElementById(newRow + "_" + newCol);
			if(cell.getAttribute("hasBomb") === "true")
			{
				++adjacentBombs;
			}
		}
	}

	return adjacentBombs;
}

var getImageForNumber = function(number) 
{
	var imgSrc = "images/Numbers/";

	switch(number)
	{
		case 0:
			imgSrc += "Zero";
			break;
		case 1:
			imgSrc += "One";
			break;
		case 2:
			imgSrc += "Two";
			break;
		case 3:
			imgSrc += "Three";
			break;
		case 4:
			imgSrc += "Four";
			break;
		case 5:
			imgSrc += "Five";
			break;
		case 6:
			imgSrc += "Six";
			break;
		case 7:
			imgSrc += "Seven";
			break;
		case 8:
			imgSrc += "Eight";
			break;
		case 9:
			imgSrc += "Nine";
			break;
	}

	return imgSrc + ".jpg";
}

window.onload = init;