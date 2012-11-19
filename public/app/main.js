define(function (require) {
    require(["jquery"], function($) {
      $(document).ready(function() {
        $('#solve').on('click',function(){
          var reader = require('modules/reader');
          var boardElements = reader.getAllElements();
          
          var gameBoard = require('modules/board');
          gameBoard.init(boardElements);

          var solver = require('modules/solver');
          solver.solve(gameBoard);

          var writer = require('modules/writer');
          writer.writeSolution(gameBoard);
        });

      });

    });
    
});