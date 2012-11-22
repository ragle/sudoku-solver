define(function(){

  // get all elements / board cells out of the DOM
  // extract relevant element metadata, populate element objects
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