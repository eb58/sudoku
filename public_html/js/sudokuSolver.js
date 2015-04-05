var sudokuSolver = (function () { // sudoku as array vec = [ 0, 3, 5, ...]
   var
      DIMSQRT = 3,
      DIM = DIMSQRT * DIMSQRT, // 9
      DIMSQR = DIM * DIM, //  81
      VALS = _.range(1, DIM + 1), //  [1,2,3,...,9]
      ROW = _.range(DIMSQR).map(function (n) { return  Math.floor(n / DIM); }),
      COL = _.range(DIMSQR).map(function (n) { return  Math.floor(n % DIM); }),
      BLK = _.range(DIMSQR).map(function (n) { return  Math.floor(ROW[n]/DIMSQRT) * DIMSQRT + Math.floor(COL[n]/DIMSQRT); });
   
   function setUsedFlags(m, n, v, b) {
      m.used[ROW[n] + ":r:" + v] = m.used[COL[n] + ":c:" + v] = m.used[BLK[n] + ":b:" + v] = b;
   }

   function setVal(m, n, v) {
      m.fld[n] = v;
      setUsedFlags(m, n, v, true);
   }

   function unsetVal(m, n) {
      setUsedFlags(m, n, m.fld[n], false);
      m.fld[n] = 0;
   }

   function possibleValues(m, n) {
      return VALS.filter(function (v) {
         return !m.used[ROW[n] + ":r:" + v] && !m.used[COL[n] + ":c:" + v] && !m.used[BLK[n] + ":b:" + v];
      });
   }

   function solve(vec) {
      var model = {fld: [], used: []};
      vec.forEach(function (v, n) {  // init
         setVal(model, n, v);
      });
      var res = [];
      var fill = function fill(m, n) {
         while (m.fld[n] !== 0 && n < DIMSQR) n++; // skip non-zeros
         if (n === DIMSQR)  return res = _.extend([], m.fld);
         possibleValues(m, n).forEach(function (v) {
            setVal(m, n, v);
            fill(m, n + 1);
            unsetVal(m, n);
         });
      }(model, 0);
      return res;
   }

   return {
      solve: solve
   };
});