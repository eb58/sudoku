/* global _ */
var sudoku2 = (function (m) {
   'use strict';
   var
      DIMSQRT = 3,
      DIM = DIMSQRT * DIMSQRT;
   var
      cntfilled = 0,
      cntset = 0,
      usedInRow = {},
      usedInCol = {},
      usedInSqr = {},
      fld = [];

   var init = function () {
      m.forEach(function (s, r) {
         fld.push([]);
         s.split('').forEach(function (n, c) {
            fld[r].push(0);
            setVal(r, c, Number(n));
         });
      });
      cntset = 0;
   }();

   function sqrKey(r, c, v) {
      return 'r:' + Math.floor(r / DIMSQRT) + 'c:' + Math.floor(c / DIMSQRT) + 'v:' + v;
   }

   function setUsedFlags(r, c, v, b) {
      usedInRow['r:' + r + 'v:' + v] = b;
      usedInCol['c:' + c + 'v:' + v] = b;
      usedInSqr[sqrKey(r, c, v)] = b;
   }

   function setVal(r, c, v) {
      cntset++; // just for info!
      cntfilled++;
      setUsedFlags(r, c, v, true);
      fld[r][c] = v;
   }

   function unsetVal(r, c) {
      var v = fld[r][c];
      setUsedFlags(r, c, v, false);
      fld[r][c] = 0;
      cntfilled--;
   }

   function isPossibleValue(r, c, v) {
      return !usedInRow['r:' + r + 'v:' + v] && !usedInCol['c:' + c + 'v:' + v] && !usedInSqr[sqrKey(r, c, v)];
   }

   function dump() {
      var s = '';
      fld.forEach(function (r) {
         r.forEach(function (n) {
            s += n + ' ';
         });
         s += '\n';
      });
      console.log('DMPFIELD:\ncntset:' + cntset + '\n' + s + '\n');
   }

   function fill(r, c) {
      if (r >= DIM) return dump();
      if (c >= DIM) return fill(r + 1, 0);
      if (fld[r][c] !== 0) return fill(r, c + 1);

      var possibleVals = _.range(1, DIM + 1).filter(function (v) { // 
         return isPossibleValue(r, c, v);
      });
      possibleVals.forEach(
         function (v) {
            setVal(r, c, v);
            fill(r, c + 1);
            unsetVal(r, c);
         }
      );
   }

   function solve() {
      fill(0, 0);
   }

   return {
      dump: dump,
      solve: solve
   };
});