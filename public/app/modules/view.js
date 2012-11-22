//DOM Interaction layer. Gets user input from game board, writes a solution

define(function(){

  var getGameElements = function(){

    var $elements = $('.boardElement');
    return $elements;
  }

  var writeSolution = function(board){
    board.elements.forEach(function(el,idx,arr){
      $('#'+idx)[0].childNodes[1].value= el.value;
    });
  }

  //Expose public reader API
  return{
    getGameElements: getGameElements,
    writeSolution: writeSolution
  }


});