{



let labir =  [
	[1,1,0,1,1,1,0,1],
        [0,0,0,1,0,0,0,1],
        [0,1,0,0,0,1,0,0],
        [0,1,0,0,0,1,0,0],
        [1,1,0,1,1,1,0,1],
        [0,0,0,1,0,0,0,1],
        [0,1,0,0,0,1,0,0],
        [0,1,0,0,0,1,0,0]
];



let start, finish;
let flag = 1;



function idToObj (id_) {

	id_ = id_.substr(2).split('_').map(string => parseInt(string));
	return {r:id_[0], c:id_[1]};
}



function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}



function make_labir (labir) {

	let rowarr = document.getElementsByTagName('row');
	let i = 0;

	for (let r of labir) {

		scr.append(document.createElement('row'));
		let j = 0;	
	
		for (let cell of r) {

			let div = document.createElement('div');
			div.id =  "id" + i + "_" + j++;
			div.className = cell ? 'cell full' : 'cell';
			div.innerHTML = '<div class="arr"></div>';
			rowarr[rowarr.length - 1].append(div);			
		}

		i++;
	}
}



function choice (event) {
	
	if (event.target.classList.value === 'cell' || event.target.classList.value === 'arr') {

		flag = (flag === 0) ? 1:0;
		let arr;

		if (flag === 0) { 

			if (start) {

					clearScr ();
			}

			start = event.target.closest('.cell').id;
			arr = document.querySelector('#' + start + ' .arr');
			arr.innerHTML = '&#9734;';			
			arr.style.animation = 'ani 0.5s forwards';}

		else{
				
			finish = event.target.closest('.cell').id;
			arr = document.querySelector('#' + finish + ' .arr');
			arr.innerHTML = '&#10026;';
			arr.style.animation = 'ani 0.5s forwards';
			(start !== finish) ? searcheShortPath (start, finish) :null;
		}				
	}			
		
}



function getNearest (cell) {
	
	nearestMatrix = [[-1, 0],
			 [0, -1],
			 [0,  1],
			 [1,  0]];

	let nearests = [];
	
	for (let i of nearestMatrix) {

            nearests.push({r:i[0] + cell.r, c:i[1] + cell.c});
        }
	
	return nearests;
}



function searhStep (cell, path) {

	let nearestCells = [];
	let nearests = getNearest(cell);

        for (let nrstCell of nearests) {

            if (nrstCell.r >= 0 
		&& nrstCell.r < labir.length 
		&& nrstCell.c >= 0 
		&& nrstCell.c < labir[0].length
		&& labir[nrstCell.r][nrstCell.c] === 0
		&& path[nrstCell.r][nrstCell.c][0] !== 1) {

                nearestCells.push(nrstCell);
		path[nrstCell.r][nrstCell.c] = [1, (path[cell.r][cell.c][1]||0) + 1, cell]; //[ïðîâåðåíà ëè ÿ÷åéêà, ðàññòîÿíèå îò ñòàðòà, îòêóäà ïðèøëè]		
            }
        }

        return nearestCells;
}



function searcheShortPath (start, finish) {	
	
	let path = Array(labir.length).fill(null).map(() => Array(labir[0].length).fill([0]));	
	let sStart = idToObj(start);
	let sFinish = idToObj(finish);
	let cellToCheck;
	let toCheck = [];
	let tmp = [];

	path[sStart.r][sStart.c] = [1, 0, 0];
	toCheck = searhStep(sStart, path);

	let i = 1;

	while (i<=labir.length * labir[0].length) {

		i++;
		cellToCheck = toCheck.shift();

		if (!cellToCheck || (cellToCheck.r === sFinish.r && cellToCheck.c === sFinish.c)) {

			return illBeBack (sFinish, path);}
	
		else {			

			toCheck.push(...searhStep(cellToCheck, path));	
		}
	}	
}



function illBeBack (cell, path){
		
	if(cell) {

		let currCell = cell;
		let shortPath = [];

		while (1) {
			
			currCell = path[currCell.r][currCell.c][2];

			if (currCell||0) {

				shortPath.push(currCell);
				
			}else {

				break;
			}			
		}

		shortPath.pop();
		trackRender (shortPath);		
	}
}



async function trackRender (sP) {	

	let cell;	
	let out_;
	let in_ = idToObj(start);
	let arrow = {};

	for (let i = sP.length - 1; i >= 0; i--) {

		out_ = (i === 0) ? idToObj(finish):sP[i - 1];		
		await sleep(100).then(() => {});
		arrow = makeArrow(in_, sP[i], out_);
		cell = document.querySelector('#id' + sP[i].r + '_' + sP[i].c + ' .arr');
		cell.innerHTML = arrow[0];
		cell.style.transform = `rotate(${arrow[1]}deg)`;
		cell.style.animation = 'ani 2.5s forwards';
		in_ = sP[i];	
	} 
}



function makeArrow(inCell, cell, outCell) {
	
	let arrow =  [
		[[],			['&#8627;', 0],		['&#8626;', 0],		['&#10141;', 90]],
		[['&#8626;', 90],	[],			['&#10141;', 180],	['&#8627;', 90]	],
		[['&#8627;', 270],	['&#10141;', 0],	[],			['&#8626;', 270]],
		[['&#10141;', 270],	['&#8626;', 180], 	['&#8627;', 180],	[]		],
	];

	let in_;
	let out_;
	
	if	(cell.r < inCell.r)	{in_ = 3}
	else if (cell.r > inCell.r)	{in_ = 0}
	else if (cell.c > inCell.c)	{in_ = 2}
	else 				{in_ = 1}

		
	if	(cell.r < outCell.r)	{out_ = 3}
	else if (cell.r > outCell.r)	{out_ = 0}
	else if (cell.c > outCell.c)	{out_ = 2}
	else 				{out_ = 1}
	
	return arrow[in_][out_];
}



function clearScr () {

	let cells = document.getElementsByClassName('arr');

	for (cell of cells) {

		cell.innerHTML = '';
		cell.style.transform = 'rotate(0deg)';
		cell.style.animation = '';
	}
}




window.onload = function(){
			
			make_labir (labir);
			scr.addEventListener('click', choice);
}



};


