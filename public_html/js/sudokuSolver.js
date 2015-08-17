var sudokuSolver = (function () {
    var statn = 0;
    var DIM = 9;
    var DIMSQR = 81; //  81
    var dump = function dump(m) {
        var s = '';
        for (var i = 0; i < DIMSQR; i++) {
            var vals = '';
            for (var v = 1; v <= DIM; v++) {
                if (m.cand[i] && m.cand[i].vals & (1 << v))
                    vals += v;
            }
            s += (i !== 0 && i % DIM === 0 ? '\n' : '') + sprintf("[%s] %-8s", m.fld[i], vals);
        }
        console.log(s);
    };

    var ALL = _.range(81);
    var COORD = _.map(ALL, function (n) {
        var r = Math.floor(n / 9);
        var c = n % 9;
        var b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        return {r: r, c: c, b: b};
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

    function setUsedFlags(m, n, v, flag) {
        var o = COORD[n];
        var mask = (1 << v);
        if (flag) {
            m.usedRow[o.r] |= mask;
            m.usedCol[o.c] |= mask;
            m.usedBlk[o.b] |= mask;
        } else {
            m.usedRow[o.r] &= ~mask;
            m.usedCol[o.c] &= ~mask;
            m.usedBlk[o.b] &= ~mask;
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
        var empty = m.empty;
        for (var r = 0; r < empty.length; r++) {
            var i = empty[r];
            if (m.fld[i] !== 0)
                continue;
            var c = getCandidates(m, i);
            if (c.cnt === 1)
                return {n: i, cand: c};
            if (!bestCandidates || c.cnt < bestCandidates.cand.cnt) {
                bestCandidates = {n: i, cand: c};
            }
            m.cand[i] = c;
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
        model.empty = _.filter(ALL, function (i) {
            return vec[i] === 0;
        });
        vec.forEach(function (v, n) {  // init
            setVal(model, n, v);
        });

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