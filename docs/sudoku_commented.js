(function($){
	$(document).ready(function(){

		//Click event handler function for the "solve" button
		$('#solve').on('click',function(){

			//generate virtual game board in memory, populate data structures
			game_board = board();

			//initialize solver object with virtual game board
			solution = solver(game_board);

			//solve the puzzle
			solution.solve();

			//write solution to real (html) game board
			for(i=0; i<81; i++){
				$('#'+i)[0].childNodes[1].value=game_board.cell_meta[i].value;
			}
		});
	});

	var board = function(){
		//Initialize Data Structures containing rows, columns, blocks, C_vectors, cell metadata
		var rows = [], cols = [], blocks = [],
			rows_v = [], cols_v = [], blocks_v=[],

			//Cell meta data is stored in an object. Meta-data stored for each cell includes column #, 
			// row#, block #, an object containing a directed graph with the id #s of all siblings, the 
			// value of the cell, and an array of possible values based on bitwise operations (see setPossibleValues function)
			cell_meta = function(){
				var cell_meta =[];
				for(var i=0; i<81; i++)
					cell_meta[i] = {id:0, row:0, col:0, block:0,
									siblings:{row:[],col:[],block:[]},
									value:0,possible_vals:[]};
				return cell_meta;
			}();

		//populate above data structures
		var populateDataStructures = function(){
			which_section =['row', 'col', 'block'];
			
			//Iterate 9 times (once for each row, block and col)
			for(var i=0; i<9; i++){
				rows[i]=[], cols[i]=[], blocks[i]=[],
				elementNumber = i + 1;
				
				///Iterate 3 times (once for row, once for col, once for block)
				for(var j=0; j< which_section.length; j++){
					$group = $('div[data-'+which_section[j]+'="'+elementNumber+'"]');
					
					//populate rows, blocks, cols and cell metadata
					$group.each(function(){
						var value = this.childNodes[1].value;
						var value = value == '' ? 0 : value;
						var id = $(this).attr('id');
						cell_meta[id].value= value;
						cell_meta[id].id=id;
						$group.each(function(){
							var local_id = $(this).attr('id');
							if (local_id != id){
								cell_meta[id].siblings[which_section[j]].push($(this).attr('id'));
							}
						});
						if(j==0){
							rows[i].push(parseInt(value));
							cell_meta[id].row=$(this).attr('data-row');
						}
						if(j==1){
							cols[i].push(parseInt(value));
							cell_meta[id].col=$(this).attr('data-col');
						}
						if(j==2){
							blocks[i].push(parseInt(value));
							cell_meta[id].block=$(this).attr('data-block');
						}
					});
				}
			}

			//populate initial C_vectors
			for(var section=0; section < 9; section++){
				rows_v[section]=[], cols_v[section]=[], blocks_v[section]=[];
				for (number=1; number<10; number++){
					var row_bit = ($.inArray(number,rows[section])) == -1 ? 0 : 1;
					var col_bit = ($.inArray(number,cols[section])) == -1 ? 0 : 1;
					var block_bit = ($.inArray(number,blocks[section])) == -1 ? 0 : 1;
					rows_v[section].push(row_bit);
					cols_v[section].push(col_bit);
					blocks_v[section].push(block_bit);
				}
			}	
		}(),

		//Define API for board object to provide consistant interface to interact with cells and associated C_Vectors
		get_rows_v = function(index){return rows_v[index];},
		get_cols_v = function(index){return cols_v[index];},
		get_blocks_v= function(index){return blocks_v[index];};
		set_rows_v = function(row, index){ rows_v[row][index] = 1;}
		set_cols_v = function(col, index){ cols_v[col][index] = 1;}
		set_blocks_v = function(block, index){ blocks_v[block][index] = 1;}

		//Return board object API
		return{get_rows_v: get_rows_v, get_cols_v: get_cols_v, get_blocks_v: get_blocks_v, 
			   cell_meta: cell_meta, set_rows_v: set_rows_v, set_cols_v: set_cols_v, set_blocks_v: set_blocks_v}
	};


	var solver = function(the_board){
		
		//initialize binary operations object to perform NOT and OR operations
		ops = binary_ops(),

		//Takes a charactaristic vector (bitmask) and returns an array of integers
		// (e.g. - [0,0,0,1,0,0,0,0,1] would return [4,9])
		getIntegers = function (mask){
			var result = [];
			for(i=0; i<9; i++){
				if (mask[i] == true)
					result.push(i+1);
			}
			return result;
		};


		//The magic happens here - you take the C Vector of an element's row, col and block and OR them, then
		// perform a NOT on that result to find the possible values for any given element
		var setPossibleVals = function(){
			for (var i=0; i<81; i++){
				var current = the_board.cell_meta[i];
				if(current.value!=0){continue;}
				possible_vals = ops.not(
										ops.or(	the_board.get_rows_v(current.row-1),
												the_board.get_cols_v(current.col-1),
											    the_board.get_blocks_v(current.block-1)
											   )
										);
				current.possible_vals = getIntegers(possible_vals);
			}
		};

		//Checks any given element's siblings (i.e. all elements in it's row, block or col) for an identical possible value (val)
		var checkSiblings = function(id, val){
			var diGraph = the_board.cell_meta[id].siblings;
			for(var i=0; i<8; i++){
				if(($.inArray(val, the_board.cell_meta[diGraph.block[i]].possible_vals) != -1)
					|| ($.inArray(val, the_board.cell_meta[diGraph.row[i]].possible_vals) != -1)
					|| ($.inArray(val, the_board.cell_meta[diGraph.col[i]].possible_vals) != -1)
				  ){
					return false;
				}
			}
			return true;
		};
		

		//Go through the entire board, and populate the possible values. Then, itterate over each element. If it has
		//only one possible value, that is its value. Set it, update C vectors, go on to the next value. If it has
		// more than one possible value, check its siblings to see if they share the same possible value. If they don't, 
		// that is its value, set it, update C Vectors, and keep going. You should recalculate possible values at the 
		// begining of each loop. You are finished when you can not update any more cells, or all cells have values. 
		var solve = function(){
			var change_flag = true;
			while(change_flag){
				change_flag = false;
				setPossibleVals();
				for(var i=0; i<81; i++){
					var current = the_board.cell_meta[i];
					if (current.value!=0){continue;}
					if(current.possible_vals.length == 1){
						current.value = current.possible_vals[0];
						the_board.set_rows_v(current.row-1,current.possible_vals[0]-1);
						the_board.set_cols_v(current.col-1,current.possible_vals[0]-1);
						the_board.set_blocks_v(current.block-1,current.possible_vals[0]-1);
						change_flag = true;
					} else if(current.possible_vals.length >1){
						for(var j=0; j<current.possible_vals.length; j++){
							if (checkSiblings(current.id, current.possible_vals[j])){
								current.value = current.possible_vals[j];
								the_board.set_rows_v(current.row-1,current.possible_vals[j]-1);
								the_board.set_cols_v(current.col-1,current.possible_vals[j]-1);
								the_board.set_blocks_v(current.block-1,current.possible_vals[j]-1);
								change_flag = true;
							}
						}
						
					}
				}
			}
		};

	return{solve:solve};
	}


	//Returns an object containing functions to perform bitwise NOT and OR operations
	var binary_ops = function(){

		//Takes a bitmask, performs a bitwise not (~) on a single mask, returns mask (C_vector)
		function b_NOT(mask){
			for(i=0; i<mask.length; i++){
				mask[i] = !mask[i];
			}
			return mask;
		}

		//Takes unlimited number of masks performs bitwise or, returns mask result (C_vector)
		function b_OR(masks){
			var mask = [];
			for(var bit=0; bit<arguments[0].length; bit++){
				var flag = false;
				for(var vector=0; vector<arguments.length; vector++){
					if (arguments[vector][bit] == true) {
						flag = true
					}
				}
				mask.push(flag);
			}
			return mask;
		}

		return{
			not:b_NOT,
			or:b_OR
		};
	}

}(jQuery))