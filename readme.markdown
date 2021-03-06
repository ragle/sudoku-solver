#A Solver for Trivial Sudoku Puzzles

###Background
This was an assignment in my Discrete Math class my sophomore year in university. The goal was to write an algorithm that would solve very simple Sudoku puzzles, using bit masks and set theory. This involved some pretty fun stuff - including hacking together some bitwise operations (JavaScript has built in bitwise operations but the assignment was to implement our own).

The algorithm only had to work for the most basic puzzles, so there is no recursive backtracking or brute force fallback. (yet :)

Also - this was a math assignment, not a software engineering assignment. The app here does not deal with unexpected input, or handle errors gracefully. 

###Adventures in Refactoring
I actually busted this assignment out a few hours before it was due. The resulting code was an absolute nightmare. If you're feeling masochistic, you can have a look at [old_versions/prototype/sudoku.js](https://github.com/ragle/sudoku-solver/blob/master/old_versions/prototype/sudoku.js).

Because this problem is complex enough to merit a bit of architecture, but simple enough to keep everything in my head and easily see the big picture - this project has become a bit of a JavaScript / architectural sandbox for me. 

As I am trying to become a better coder - I am testing out what I am learning here - on a solved, well understood problem. 

The code in [/public/app](https://github.com/ragle/sudoku-solver/tree/master/public/app) is my latest attempt. It's far from perfect, but I doubt anyone could say it isn't an improvement over the original (in terms of readability and maintainability). 

If you've got any suggestions, drop me a line! 

###Payap Students
If you've hit a wall with this assignment, and would like to chat about it, I could be encouraged to bounce some ideas back and forth over a Dunkelweizen at Neighborhood!
