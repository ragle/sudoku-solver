//reader.js - DOM Interaction Layer - pulls data off of the interface
//          to be used to populate the virtual board for the solver
//          and write a solution to the UI.

define(function(){

  var getAllElements = function(){

    var $elements = $('.boardElement'),
        elements = [];

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

    setSiblings(elements);
    return elements;
  }

  setSiblings = function(elements){
    //Shitty O(n^2) search for siblings, but we're only searching ~80 objects, so fuck it.
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

  //Expose module API
  return{
    getAllElements: getAllElements
  }


});