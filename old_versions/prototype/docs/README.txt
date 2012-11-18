DESCRIPTION OF FILES
--------------------
sudoku.html - Contains the gameboard. Loads the css (style) file, along with the
              JavaScript file that solves the puzzle

style.css - styles for the gameboard

sudoku.js - JavaScript solution, solves the puzzle



docs/boardGenerator.php - a snippit of PHP I wrote to dynamically generate the table within sudoku.html

docs/sudoku_commented - Above file, with comments


DISCLOSURE OF SOURCES
---------------------
1) The JavaScript algorithm is 100% my own work

2) I did make use of the jQuery JavaScript library by John Resig: 
http://docs.jquery.com/Main_Page

3) The user interface (table / board) was inspired by the board here:

http://ie.microsoft.com/testdrive/Performance/Sudoku/Default.html

Note that I wrote the php to generate a custom table (based on
the html structure of the above layout) from scratch that would 
better suit my needs (see boardGenerator.php), and styled it in my own way.
