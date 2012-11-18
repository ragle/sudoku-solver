(function($){
	$(document).ready(function(){
		$('#solve').on('click',function(){
			game_board = board();
			solution = solver(game_board);
			solution.solve();
			for(i=0; i<81; i++){
				$('#'+i)[0].childNodes[1].value=game_board.cell_meta[i].value;
			}
		});
	});

	var board = function(){
		//Initialize Data Structures containing rows, columns, blocks, C_vectors, cell metadata
		var rows = [], cols = [], blocks = [],
			rows_v = [], cols_v = [], blocks_v=[],
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

		get_rows_v = function(index){return rows_v[index];},
		get_cols_v = function(index){return cols_v[index];},
		get_blocks_v= function(index){return blocks_v[index];};
		set_rows_v = function(row, index){ rows_v[row][index] = 1;}
		set_cols_v = function(col, index){ cols_v[col][index] = 1;}
		set_blocks_v = function(block, index){ blocks_v[block][index] = 1;}

		return{get_rows_v: get_rows_v, get_cols_v: get_cols_v, get_blocks_v: get_blocks_v, 
			   cell_meta: cell_meta, set_rows_v: set_rows_v, set_cols_v: set_cols_v, set_blocks_v: set_blocks_v}
	};

	var solver = function(the_board){
		ops = binary_ops(),
		getIntegers = function (mask){
			var result = [];
			for(i=0; i<9; i++){
				if (mask[i] == true)
					result.push(i+1);
			}
			return result;
		};

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
		
		var solve = function(){
			var change_flag = true;
			while(change_flag){
				change_flag = false;
				setPossibleVals();
				for(var i=0; i<81; i++){
					var current = the_board.cell_meta[i];
					if (current.value!=0){continue;}
					var setVals = function(val){
						current.value = current.possible_vals[val];
						the_board.set_rows_v(current.row-1,current.possible_vals[val]-1);
						the_board.set_cols_v(current.col-1,current.possible_vals[val]-1);
						the_board.set_blocks_v(current.block-1,current.possible_vals[val]-1);
						change_flag = true;
					};
					if(current.possible_vals.length == 1){
						setVals(0);
					} else if(current.possible_vals.length >1){
						for(var j=0; j<current.possible_vals.length; j++){
							if (checkSiblings(current.id, current.possible_vals[j])){
								setVals(j);
							}
						}
						
					}
				}
			}
		};

	return{solve:solve};
	}

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