quarto = {
	currentTable: [],
	_defaults: {
		gameContainer: null
	},
	_init: function(options) {
		this.options = this._extend(this._defaults, options);
		this._createInterface();
		this._setEvents();
	},
	_createInterface: function() {
		if(this.options.gameContainer) {
			this.createGrid();
			this.piecesContainer = document.createElement('div');
			this.piecesContainer.className = 'pieces-container';
			this.options.gameContainer.appendChild(this.piecesContainer);
			this.createPieces();
		}
	},
	_setEvents: function() {
		var draggedElement;

		document.addEventListener('dragstart', function(e) {
			// store a ref. on the dragged elem
			if(e.target.className.match('piece') && e.target.parentElement.className === 'pieces-container'){
				draggedElement = e.target;
				// make it half transparent
				draggedElement.style.opacity = 0.5;
			}
		}, false);

		document.addEventListener("dragover", function(e) {
			e.preventDefault();
			if(e.target.tagName.toLowerCase() === 'td') {
				e.dataTransfer.dropEffect = "move";
				e.target.style.background = 'lightgrey';
			}
		});

		document.addEventListener("dragleave", function(e) {
			e.preventDefault();
			if(e.target.tagName.toLowerCase() === 'td') {
				e.target.style.background = 'white';
			}
		});

		document.addEventListener('drop', function(e) {
			e.preventDefault();
			var cell = e.target;
			if(draggedElement && cell.tagName.toLowerCase() === 'td'){
				cell.appendChild(draggedElement);
				cell.style.background = 'white';
				this.winCheck(cell);
			}
			draggedElement.style.opacity = 1;
			draggedElement = null;
		}.bind(this));
	},
	createGrid: function() {
		var table = document.createElement('table');
		for(var y = 1; y <= 4; y++){
			var line = document.createElement('tr');
			this.currentTable[y] = [];
			for(var x = 1; x <= 4; x++){
				var cell = document.createElement('td');
				cell.dataset.x = x;
				cell.dataset.y = y;
				this.currentTable[y][x] = cell;
				line.appendChild(cell);
			}
			table.appendChild(line);
		}
		this.options.gameContainer.appendChild(table);
	},
	createPieces: function() {
		var pieces = [],
			size = ['small', 'large'],
			color = ['red', 'blue'],
			shape = ['round', 'square'],
			surface = ['plain', 'pierced'];

		for(var i = 0; i < size.length; i++) {
			for(var j = 0; j < color.length; j++) {
				for(var k = 0; k < shape.length; k++) {
					for(var l = 0; l < surface.length; l++) {
						pieces.push({
							size: size[i],
							color: color[j],
							shape: shape[k],
							surface: surface[l]
						});
					}
				}
			}
		}

		pieces.forEach(function(piece) {
			var uiPiece =  document.createElement('div');
			uiPiece.draggable = true;
			uiPiece.className = 'piece '+piece.size+' '+piece.color+' '+piece.shape+' '+piece.surface;
			this.piecesContainer.appendChild(uiPiece);
		}.bind(this));
	},
	setDragEvent: function() {
		var cells = document.querySelectorAll('td');
		for(var i = 0; i < cells.length; i++){
			var cell = cells[i];
			cell.addEventListener('mouseenter', function(e) {
				if(this.mouseIsDown){
					var cell = e.target;
					if(cell.tagName.toLowerCase() === 'td'){
						if(!this.isAlive(cell)){
							this.toggleCellStatus(cell);
						}
					}
				}
			}.bind(this));
		}
	},
	winCheck: function(playedCell) {
		// var cellClasses = playedCell.className.split(' ');
		// console.log(cellClasses);
		// console.log(this.currentTable);
		var relativesX = [],
			relativesY = [];
		for (i = 1; i <= 4; i++) {
			console.log(playedCell);
			relativesX.push(this.currentTable[playedCell.dataset.y][i]);
			relativesY.push(this.currentTable[i][playedCell.dataset.x]);
		}

		console.log(relativesY, relativesX);
	},
	_extend : function(a, b) {
		for(var key in b) {
			if(b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
};