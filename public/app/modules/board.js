// Virtual sudoku board consisting of sets of bitmasks representing 
// colums, rows and blocks. 

define(function(require){

  var mask = require('modules/bitmask');

  //bitmask collections
  var cols = [], rows = [],blocks = [];

  //board elements / cells
  var elements = [];

  var init = function($elements){
    
    //pull out element meta data (row, col, etc)
    importElementMeta($elements);

    //assign siblings (elements in same row, col or block)
    setSiblings(elements);

    //initialize empty bitmasks for each row, col and block
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

  var importElementMeta= function($elements){
    $elements.each(function(){
      var $this = $(this),
      el ={
        id: $this.attr('id'),
        col: $this.attr('data-col'),
        row: $this.attr('data-row'),
        block: $this.attr('data-block'),
        value: this.childNodes[1].value,
        posVals: [],
        siblings: []
      };
      elements[el.id] = el;   
    });
  }

  var setSiblings = function(elements){
    // Shitty O(n^2) search for siblings, but we're only searching 
    // ~80 objects...
    elements.forEach(function(curElement, idx, arr){
      arr.forEach(function(checkElement, idx, arr){

        //these are not the elements you're looking for...
        if(curElement.id == checkElement.id){return;}

        //Mark as siblings if row, col or block matches
        var sameRow   = curElement.row   == checkElement.row,
            sameCol   = curElement.col   == checkElement.col,
            sameBlock = curElement.block == checkElement.block;

        if (sameRow || sameCol || sameBlock){
          curElement.siblings.push(checkElement.id);
        }

      })

    });

  }


//expose public gameboard API
return {
  cols: cols,
  blocks: blocks,
  rows: rows,
  init: init,
  updateMasks: updateMasks,
  elements: elements
}

});