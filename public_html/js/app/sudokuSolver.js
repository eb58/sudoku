/* global _ */

const sudokuSolver = (function () {
  let statn = 0;
  const ALL = _.range(81);
  const COORD = ALL.map(n => {
    const r = Math.floor(n / 9);
    const c = n % 9;
    return {r, c, b: Math.floor(r / 3) * 3 + Math.floor(c / 3)};
  });
  const FLDSINBLK = [[], [], [], [], [], [], [], [], []];
  const FLDSINROW = [[], [], [], [], [], [], [], [], []];
  const FLDSINCOL = [[], [], [], [], [], [], [], [], []];
  for (let i = 0; i < 81; i++) {
    const c = COORD[i];
    FLDSINROW[c.r].push(i);
    FLDSINCOL[c.c].push(i);
    FLDSINBLK[c.b].push(i);
  }

  function initEmpty(m) {
    m.empty = ALL.filter(i => m.fld[i] === 0);
    for (let r = 0; r < m.empty.length; r++) {
      m.cand[m.empty[r]] = getCandidates(m, m.empty[r]);
    }
    m.empty.sort((a, b) => (m.cand[b].cnt - m.cand[a].cnt));
  }

  function setUsedFlags(m, n, v, flag) {
    const o = COORD[n];
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
    const o = COORD[n];
    const unsetbits = ~(m.usedRow[o.r] | m.usedCol[o.c] | m.usedBlk[o.b]);
    const res = {cnt: 0, vals: unsetbits};
    for (let v = 1; v <= 9; v++) {
      if (unsetbits & (1 << v)) {
        res.cnt++;
      }
    }
    return res;
  }

  function getBestCandidates(m) { // returns entry with shortest list of candidates  
    let bestCandidates = null;
    m.cand = [];
    for (let r = 0; r < m.empty.length; r++) {
      if (m.fld[m.empty[r]] !== 0)
        continue;
      const c = getCandidates(m, m.empty[r]);
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
    for (let v = 1; v <= 9; v++) { // all possible values of fld = 1,2,3,...,9
      const mask = 1 << v;
      for (let n = 0; n < 9; n++) { // all blocks ( or  cols or rows )
        let cnt = 0, fld = -1, flds = FLDS[n];
        for (let i = 0; i < flds.length; i++) { // all fields of fieldset
          const x = m.cand[flds[i]];
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
    for (let i = 0; i < m.cand.length; i++) { // all fields of fieldset
      const c1 = m.cand[i];
      if (c1 === undefined || c1.cnt !== 2)
        continue;
      const o1 = COORD[i];
      for (let j = i + 1; j < m.cand.length; j++) { // all fields of fieldset
        const c2 = m.cand[j];
        if (c2 === undefined || c2.cnt !== 2)
          continue;
        if (c1.vals === c2.vals) {
          const o2 = COORD[j];
          if (o1.r === o2.r) {
            console.log('PAIR found', c1, i, j);
            dump(m);
          }
        }
      }
    }
    return false;
  }

  function solve(v) { // sudoku as array  [ 0, 3, 5, ...] or as String '.2..3.....6...7........'
    
    statn = 0;
    const model = {
      cnt: 0,
      fld: [],
      cand: [],
      usedRow: [],
      usedCol: [],
      usedBlk: []
    };
    
    const arr = (typeof v === 'string') ? v.replace(/[^1-9]/g, '0').split('').map(n => Number(n)) : v
    arr.forEach((v, n) => setVal(model, n, v));
    
    initEmpty(model);

    let res = null;
    const fill = m => {
      if (m.cnt === 81)
        return res = [...m.fld];
      let c = getBestCandidates(m);
      if (!c)
        return;
      if (c.cand.cnt > 1) {
        const hn = findHiddenNaked(m);
        c = hn ? hn : c;
        // if( c.cand.cnt > 1 ) findPairs(m);
      }
      for (let i = 1; i <= 9; i++) {
        if (c.cand.vals & (1 << i)) {
          setVal(m, c.n, i);
          fill(m);
          if (!res)
            unsetVal(m, c.n);
        }
      }
    };
    fill(model);
    console.log(statn);
    return res.join('');
  }
  return {
    solve,
  };
});