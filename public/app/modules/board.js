//Virtual sudoku board consisting of sets of bitmasks representing 
//colums, rows and blocks

define(function(require){

  var mask = require('modules/bitmask');

  //bitmask collections
  var cols = [], rows = [],blocks = [];

  //board elements / cells
  var elements = [];

  var init = function(_elements){
    
    importElements(_elements);  //hack - see below

    initMasks();

    //update bitmasks based on values of each element
    elements.forEach(function(element, idx, arr){
      if (element.value == ''){return;}
      updateMasks(element);
    });
  };

  // create 27  9-bit bitmasks, one for each row, col and block
  // all bits initialized to 0
  var initMasks = function(){
    for(var i=0; i<9; i++){
      cols[i] = new mask.BitMask(); 
      rows[i] = new mask.BitMask(); 
      blocks[i] = new mask.BitMask();
    }
  };

  var updateMasks = function(el){
    //determine appropriate bitmasks to update
    colIdx = el.col - 1;
    rowIdx = el.row - 1;
    blockIdx = el.block -1;
    bMaskIdx = el.value -1;

    //set bit to true to indicate value exists in set
    cols[colIdx].update(bMaskIdx);
    rows[rowIdx].update(bMaskIdx);
    blocks[blockIdx].update(bMaskIdx); 
  };

  // very crufty hack to get around scope issue or some issue with
  // require.js and references. _elements.slice(0) doesn't work? 
  // Need to investigate further, or really just refactor so that 
  // elements get built by board constructor instead of reader. 
  // reader should really be just "view", and worry only about DOM 
  //interaction... tsk, tsk, tsk...
  var importElements= function(_elements){
    for(var i = 0; i<_elements.length; i++){
      elements[i] = _elements[i];
    }
  }


//expose public board API
return {
  cols: cols,
  blocks: blocks,
  rows: rows,
  init: init,
  updateMasks: updateMasks,
  elements: elements
}

});