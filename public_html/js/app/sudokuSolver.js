var sudokuSolver = (function () {
   var statn = 0;
   var ALL = _.range(81);
   var COORD = ALL.map( function (n) {
      var r = Math.floor(n / 9);
      var c = n % 9;
      return {r: r, c: c, b: Math.floor(r / 3) * 3 + Math.floor(c / 3)};
   });
   var FLDSINBLK = [[], [], [], [], [], [], [], [], []];
   var FLDSINROW = [[], [], [], [], [], [], [], [], []];
   var FLDSINCOL = [[], [], [], [], [], [], [], [], []];
   for (var i = 0; i < 81; i++) {
      var c = COORD[i];
      FLDSINROW[c.r].push(i);
      FLDSINCOL[c.c].push(i);
      FLDSINBLK[c.b].push(i);
   }

   function initEmpty(m) {
      m.empty = ALL.filter( i=>  m.fld[i] === 0 );
      for (var r = 0; r < m.empty.length; r++) {
         m.cand[m.empty[r]] = getCandidates(m, m.empty[r]);
      }
      m.empty.sort( (a, b) => (m.cand[b].cnt - m.cand[a].cnt));

   }

   function setUsedFlags(m, n, v, flag) {
      var o = COORD[n];
      if (flag) {
         m.usedRow[o.r] |= 1 << v;
         m.usedCol[o.c] |= 1 << v;
         m.usedBlk[o.b] |= 1 << v;
      } else {
         m.usedRow[o.r] &= ~(1 << v);
         m.usedCol[o.c] &= ~(1 << v);
         m.usedBlk[o.b] &= ~(1 << v);
      }
   }

   function setVal(m, n, v) {
      statn++;
      if (v !== 0)
         m.cnt++;
      m.fld[n] = v;
      setUsedFlags(m, n, v, true);
   }

   function unsetVal(m, n) {
      m.cnt--;
      setUsedFlags(m, n, m.fld[n], false);
      m.fld[n] = 0;
   }

   function getCandidates(m, n) {  // Candidates for m[n]
      var o = COORD[n];
      var unsetbits = ~(m.usedRow[o.r] | m.usedCol[o.c] | m.usedBlk[o.b]);
      var res = {cnt: 0, vals: unsetbits};
      for (var v = 1; v <= 9; v++) {
         if (unsetbits & (1 << v)) {
            res.cnt++;
         }
      }
      return res;
   }

   function getBestCandidates(m) { // returns entry with shortest list of candidates  
      var bestCandidates = null;
      m.cand = [];
      for (var r = 0; r < m.empty.length; r++) {
         if (m.fld[m.empty[r]] !== 0)
            continue;
         var c = getCandidates(m, m.empty[r]);
         if (c.cnt === 1)
            return {n: m.empty[r], cand: c};
         if (!bestCandidates || c.cnt < bestCandidates.cand.cnt) {
            bestCandidates = {n: m.empty[r], cand: c};
         }
         m.cand[m.empty[r]] = c;
      }
      return bestCandidates;
   }

   function findHN(m, FLDS) {
      for (var v = 1; v <= 9; v++) { // all possible values of fld = 1,2,3,...,9
         var mask = 1 << v;
         for (var n = 0; n < 9; n++) { // all blocks ( or  cols or rows )
            var cnt = 0, fld = -1, flds = FLDS[n];
            for (var i = 0; i < flds.length; i++) { // all fields of fieldset
               var x = m.cand[flds[i]];
               if (x && (x.vals & mask)) {
                  if (++cnt > 1)
                     break;
                  fld = flds[i];
               }
            }
            if (cnt === 1) {
               //console.log(">>> Naked Single: ", v, " Cell:", fld, flds);
               //dump(m);
               return {n: fld, cand: {cnt: 1, vals: mask}};
            }
         }
      }
      return null;
   }

   function findHiddenNaked(m) {
      return findHN(m, FLDSINBLK) || findHN(m, FLDSINROW) || findHN(m, FLDSINCOL);
   }

   function findPairs(m) {
      for (var i = 0; i < m.cand.length; i++) { // all fields of fieldset
         var c1 = m.cand[i];
         if (c1 === undefined || c1.cnt !== 2)
            continue;
         var o1 = COORD[i];
         for (var j = i + 1; j < m.cand.length; j++) { // all fields of fieldset
            var c2 = m.cand[j];
            if (c2 === undefined || c2.cnt !== 2)
               continue;
            if (c1.vals === c2.vals) {
               var o2 = COORD[j];
               if (o1.r === o2.r) {
                  console.log('PAIR found', c1, i, j);
                  dump(m);
               }
            }
         }
      }
      return false;
   }

   function solve(vec) { // sudoku as array vec = [ 0, 3, 5, ...]
      statn = 0;
      var model = {
         cnt: 0,
         fld: [],
         cand: [],
         usedRow: [],
         usedCol: [],
         usedBlk: []
      };
      vec.forEach(function (v, n) {  // init
         setVal(model, n, v);
      });
      initEmpty(model);

      var res = null;
      var fill = function fill(m) {
         if (m.cnt === 81)
            return res = _.extend([], m.fld);
         var c = getBestCandidates(m);
         if (!c)
            return;
         if (c.cand.cnt > 1) {
            var hn = findHiddenNaked(m);
            c = hn ? hn : c;
            //if( c.cand.cnt > 1 ) findPairs(m);
         }
         for (var i = 1; i <= 9; i++) {
            if (c.cand.vals & (1 << i)) {
               setVal(m, c.n, i);
               fill(m);
               if (!res)
                  unsetVal(m, c.n);
            }
         }
      }(model);
      //console.log(statn);
      return res;
   }
   return {
      solve: solve
   };
});