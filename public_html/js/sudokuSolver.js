var sudokuSolver = (function () {
   var
      DIMSQRT = 3,
      DIM = DIMSQRT * DIMSQRT, // 9
      DIMSQR = DIM * DIM, //  81
      ROW = _.range(DIMSQR).map(function (n) {return  Math.floor(n / DIM);   }),
      COL = _.range(DIMSQR).map(function (n) {return  n % DIM;}),
      BLK = _.range(DIMSQR).map(function (n) {return  Math.floor(Math.floor(ROW[n] / DIMSQRT) * DIMSQRT + Math.floor(COL[n] / DIMSQRT));});

   function genArr() {
      return _.range(DIM).map(function () {
         return [];
      });
   }

   function setUsedFlags(m, n, v, b) {
      m.usedRow[ROW[n]][v] = m.usedCol[COL[n]][v] = m.usedBlk[BLK[n]][v] = b;
   }

   function setVal(m, n, v) {
      if (v !== 0) m.cnt++;
      m.fld[n] = v;
      setUsedFlags(m, n, v, true);
   }

   function unsetVal(m, n) {
      m.cnt--;
      setUsedFlags(m, n, m.fld[n], false);
      m.fld[n] = 0;
   }

   function getCandidates(m, n) {  // Candidates for m[n]
      for (var res = [], v = 1; v <= DIM; v++) {
         if (!m.usedRow[ROW[n]][v] && !m.usedCol[COL[n]][v] && !m.usedBlk[BLK[n]][v])
            res.push(v);
      }
      return res;
   }

   function getBestCandidates(m) {
      var minLength = 100000;
      var bestCandidates = {n:-1,cand:[]};
      for (var i = 0; i < DIMSQR; i++){
         if (m.fld[i] !== 0) continue;
         var c = getCandidates(m, i);
         if (c.length === 1) return {n: i, cand: c};
         if (c.length < minLength) {
            minLength = c.length;
            bestCandidates = {n: i, cand: c};
         }
      }
      return bestCandidates;
   }

   function solve(vec) { // sudoku as array vec = [ 0, 3, 5, ...]
      var model = {fld: [], cnt: 0, usedRow: genArr(), usedCol: genArr(), usedBlk: genArr()};
      vec.forEach(function (v, n) {  // init
         setVal(model, n, v);
      });
      var res = null;
      var fill = function fill(m) {
         if (m.cnt === DIMSQR)
            return res = _.extend([], m.fld);
         var c = getBestCandidates(m);
         for (var i = 0; i < c.cand.length; i++) {
            setVal(m, c.n, c.cand[i]);
            fill(m);
            if(  !res ) unsetVal(m, c.n);
         }
      }(model);
      return res;
   }
   return {
      solve: solve
   };
});