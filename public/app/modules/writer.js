//writer.js  - DOM Interaction Layer, provides functionality
//             to write a solution to the game board

define(function(){

  var writeSolution = function(board){
    board.elements.forEach(function(el,idx,arr){
      $('#'+idx)[0].childNodes[1].value= el.value;
    });
  }

  return {writeSolution: writeSolution};

});