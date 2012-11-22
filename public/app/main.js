define(function (require) {
    require(["jquery"], function($) {
      $(document).ready(function() {
        $('#solve').on('click',function(){
          var view = require('modules/view');
          var boardElements = view.getGameElements();
          
          var gameBoard = require('modules/board');
          gameBoard.init(boardElements);

          var solver = require('modules/solver');
          solver.solve(gameBoard);

          view.writeSolution(gameBoard);
        });

      });

    });
    
});