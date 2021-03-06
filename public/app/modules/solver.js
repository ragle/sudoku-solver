define(function(require){

  var BitMask = require('modules/bitmask').BitMask;

  var solve = function(board){

    var changeFlag = false;

    //continue to itterate until we can't make any more changes...
    do {
      changeFlag = false;
        generatePossibleVals(board);
        board.elements.forEach(function(el, idx, arr){
          
          //We know this value already
          if(el.value!=0){return;}

          // if there is only one possible value, that's it. 
          // Set it, update masks
          if(el.posVals.length == 1){
            setAndUpdate(board, el, el.posVals[0]);
            changeFlag = true;
            return;
          }

          // else, search siblings
          for(var i=0; i<el.posVals.length; i++){
            value = checkSiblings(board, el, el.posVals[i]);
            if (value){
              setAndUpdate(board, el, value);
              changeFlag = true;
            }
          }

        });
      } while(changeFlag);
  }

  // Generate a list of possible values for an element
  // using characteristic vectors (bitmasks) and binary ops
  var generatePossibleVals = function(board){
    board.elements.forEach(function(el, idx, arr){
      if(el.value != 0){return;}
      var possibleVals = bitwise.not(
                                     (bitwise.or(board.cols[el.col - 1].mask,
                                               board.rows[el.row - 1].mask,
                                               board.blocks[el.block -1].mask
                                     ))
                                    );
      el.posVals = possibleVals.toInt();
    });
  }

  // set the value of an element, update relevant bitmasks         
  var setAndUpdate = function(board, el, value){
    el.value = value;
    var updateIdx = value-1;

    board.cols[el.col -1].update(updateIdx);
    board.rows[el.row -1].update(updateIdx);
    board.blocks[el.block -1].update(updateIdx);
  };

  // search through an element's siblings, checking to see if 
  // the possible value of our element (that we are checking) 
  // is also a possible value of any sibling...
  var checkSiblings = function(board, el, checkVal){
    var sibs = el.siblings;

    for(var i=0; i<sibs.length; i++){
      match = $.inArray(checkVal, board.elements[sibs[i]].posVals) != -1 ? true : false; 
      if (match){return false}
    }
  
    return checkVal;
  };

  // binary bitwise operations. Yes - JavaScript has built in bitwise operations.
  // The assignment was to build your own. Arrays offer a good visualization
  // of the problem / solution during debugging.
  var bitwise = function(){

    //Takes a bitmask, performs a bitwise not (~) on a single mask 
    // returns result mask 
    var b_NOT = function(bmask){
      result = new BitMask();
      for(i=0; i<bmask.mask.length; i++){
        result.mask[i] = !bmask.mask[i];
      }
      return result;
    };

    //Takes unlimited number of masks - performs bitwise or, 
    // returns result mask
    var b_OR = function(masks){
      var result = new BitMask();
      for(var bit=0; bit<arguments[0].length; bit++){
        var flag = false;
        for(var vector=0; vector<arguments.length; vector++){
          if (arguments[vector][bit] == true) {
            flag = true;
          }
        }
        result.mask[bit] = flag;
      }
      return result;
    };

    return{
      not: b_NOT,
      or: b_OR
    };
    
  }();

  //Expose public solver API
  return{
    solve:solve
  }


});