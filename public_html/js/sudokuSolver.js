var sudokuSolver = (function (fld) { // sudokuo as array fld = [ 0, 3, 5, ...]
   var
      DIMSQRT = 3,
      DIM = DIMSQRT * DIMSQRT,
      used = [];
   
   fld.forEach( function (v, n) {  // init
         setVal(n, v);
      }
   );

   function coord(n){ return{ r: Math.floor(n / DIM), c: Math.floor(n % DIM) }; }

   function setUsedFlags(n, v, b) {
      var p = coord(n);
      used['r:' + p.r + ':' + v] = used['c:' + p.c + ':' + v] = used[Math.floor(p.r / DIMSQRT) + ':' + Math.floor(p.c / DIMSQRT) + ':' + v] = b;
   }

   function setVal(n, v) {
      fld[n] = v;
      setUsedFlags(n, v, true);
   }

   function unsetVal(n) {
      setUsedFlags(n, fld[n], false);
      fld[n] = 0;
   }

   function possibleValues(n) {
      var p = coord(n);
      return _.range(1, DIM + 1).filter(function (v) {
         return !used['r:' + p.r + ':' + v] && !used['c:' + p.c + ':' + v] && !used[Math.floor(p.r / DIMSQRT) + ':' + Math.floor(p.c / DIMSQRT) + ':' + v];
      });
   }

   function solve() {
      var res = [];
      var fill = function fill(n) {
        if (n === DIM*DIM) return res = $.extend(true, [], fld);
        if (fld[n] !== 0) return fill(n + 1);
        possibleValues(n).forEach(function (v) {
            setVal(n, v);
            fill(n + 1);
            unsetVal(n);
         });
      }(0);
      return res;
   }
   
   return {
      solve: solve
   };
});