// A bitmask, for our purposes represented by an array where each array 
// index maps to a bit. 9 bits in each mask - one for every element / cell 
// in a row, colum or block on the board. The virtual board contains 
// 27 bitmasks in all - 9 rows, 9 cols, 9 blocks.

define(function(){

  var BitMask = function(){
    this.mask = [];
    for (var i=0; i<9; i++){
      this.mask[i] = 0;
    }
  };

  //returns an array of integers representing which numbers from the set 1...9
  // are currently stored in the bitmask
  BitMask.prototype.toInt = function(){
    var intRepresentation = [];
      for(var i=0; i<9; i++){
        if (this.mask[i] == true)
          intRepresentation.push(i+1);
      }
      return intRepresentation;
  };

  //updates the bitmask to reflect the addition of a new element to the set
  BitMask.prototype.update = function(idx){
    this.mask[idx] = 1;
  };

  return {
    BitMask: BitMask
  }

});