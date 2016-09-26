/* global sudokuSolver */
// http://www.sudokubum.com/
var sudoku = function () {
   var ss = sudokuSolver();
   function init(s) {
      return s.replace(/\./g, '0').split('').map( v => Number(v) );
   }

   function dump(msg, s) {
      console.log(msg + ':' + s);
   }

   function doit(s) {
      return ss.solve(init(s)).join('');
   }
   
   function doit2(s) {
      dump('IN ', s);
      var res = doit(s);
      dump('OUT', res);
      return res;
   }
   
   return {
      doit: doit,
      doit2: doit2
   };
};