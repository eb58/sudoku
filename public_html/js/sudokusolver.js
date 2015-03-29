var sudoku = (function (m) {
   'use strict';
   var
      DIMSQRT = 3,
      DIM = DIMSQRT * DIMSQRT;
   var
      cntset = 0, // just info
      fld = [],
      used = [];

   m.forEach(function (s, r) {  // init fld
      s.split('').forEach(function (v, c) {
         setVal(r, c, Number(v));
      });
   });

   function dump() {
      var s = '';
      fld.forEach(function (row) {
         row.forEach(function (n) {
            s += n + ' ';
         });
         s += '\n';
      });
      console.log('FIELD:\ncntset:' + cntset + '\n' + s + '\n');
   }

   function setUsedFlags(r, c, v, b) {
      used['r:' + r + ':' + v] = used['c:' + c + ':' + v] = used[Math.floor(r / DIMSQRT) + ':' + Math.floor(c / DIMSQRT) + ':' + v] = b;
   }

   function setVal(r, c, v) {
      cntset++; // just for info!
      if( !fld[r] ) fld[r] = [];
      fld[r][c] = v;
      setUsedFlags(r, c, v, true);
   }

   function unsetVal(r, c) {
      setUsedFlags(r, c, fld[r][c], false);
      fld[r][c] = 0;
   }

   function possibleValues(r, c) {
      return _.range(1, DIM + 1).filter(function (v) {
         return !used['r:' + r + ':' + v] && !used['c:' + c + ':' + v] && !used[Math.floor(r / DIMSQRT) + ':' + Math.floor(c / DIMSQRT) + ':' + v];
      });
   }

   function fill(r, c) {
      if (r >= DIM) return dump();
      if (c >= DIM) return fill(r + 1, 0);
      if (fld[r][c] !== 0) return fill(r, c + 1);
      possibleValues(r, c).forEach(
         function (v) {
            setVal(r, c, v);
            fill(r, c + 1);
            unsetVal(r, c);
         }
      );
   }

   function solve() {
      dump();
      fill(0, 0);
   }

   return {
      solve: solve
   };
});