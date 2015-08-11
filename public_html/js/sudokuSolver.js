var sudokuSolver = (function () {
    var statn = 0;
    var DIM = 9;
    var DIMSQRT = Math.sqrt(DIM); //3
    var DIMSQR = DIM * DIM; //  81
    var dump = function dump(m) {
        var s = '';
        for (var i = 0; i < 81; i++) {
            s += (i % 9 === 0 ? '\n' : '') + sprintf("[%s] %-1s ", m.fld[i], '');
        }
        console.log(s);
    };
    var FLDSINBLK = _.range(DIM).map(function (b) {
        return _.range(DIM).map(function (n) {
            return ([0, 3, 6, 27, 30, 33, 54, 57, 60])[b] + ([0, 1, 2, 9, 10, 11, 18, 19, 20])[n];
        });
    });

    function setUsedFlags(m, n, v, flag) {
        var r = Math.floor(n / DIM);
        var c = n % DIM;
        var b = Math.floor(r / DIMSQRT) * DIMSQRT + Math.floor(c / DIMSQRT);
        if (flag) {
            var mask = (1 << v);
            m.usedRow[r] |= mask;
            m.usedCol[c] |= mask;
            m.usedBlk[b] |= mask;
        } else {
            var mask = ~(1 << v);
            m.usedRow[r] &= mask;
            m.usedCol[c] &= mask;
            m.usedBlk[b] &= mask;
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
        var r = Math.floor(n / DIM);
        var c = n % DIM;
        var b = Math.floor(r / DIMSQRT) * DIMSQRT + Math.floor(c / DIMSQRT);
        var res = {cnt: 0, vals: 0};
        for (var v = 1; v <= DIM; v++) {
            var mask = 1 << v;
            if (!(m.usedCol[c] & mask || m.usedRow[r] & mask || m.usedBlk[b] & mask)) {
                res.vals |= mask;
                res.cnt++;
            }
        }
        return res;
    }

    function getBestCandidates(m) { // returns entry with shortest list of candidates  
        var bestCandidates = null;
        m.cand = [];
        for (var i = 0; i < DIMSQR; i++)
            if (!m.fld[i]) {
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

    function findHiddenNaked(m) {
        for (var v = 1; v <= DIM; v++) { // all possible values of fld = 1,2,3,..9
            var mask = 1 << v;
            for (var b = 0; b < DIM; b++) { // all blocks ( or  cols or rows )
                var cnt = 0, fld = -1, flds = FLDSINBLK[b];
                for (var i = 0; i < flds.length; i++) { // all fields of fieldset
                    var x = m.cand[flds[i]];
                    if (x && (x.vals & mask)) {
                        if (++cnt > 1)
                            break;
                        fld = flds[i];
                    }
                }
                if (cnt === 1) {
                    //console.log("Naked Single: ", v, ' Block ', b, " Cell:", fld, flds);
                    //dump(m);
                    return {n: fld, cand: {cnt: 1, vals: (1 << v)}};
                }
            }
        }
        return null;
    }

    function solve(vec) { // sudoku as array vec = [ 0, 3, 5, ...]
        statn = 0;
        var model = {fld: [], cand: [], cnt: 0, usedRow: [], usedCol: [], usedBlk: []};
        vec.forEach(function (v, n) {  // init
            setVal(model, n, v);
        });
        var res = null;
        var fill = function fill(m) {
            if (m.cnt === DIMSQR)
                return res = _.extend([], m.fld);
            var c = getBestCandidates(m);
            if (c && c.cand.cnt > 1) {
                var hn = findHiddenNaked(m);
                if (hn)
                    c = hn;
            }
            if (c) {
                for (var i = 1; i <= DIM; i++) {
                    if (c.cand.vals & (1 << i)) {
                        setVal(m, c.n, i);
                        fill(m);
                        if (!res)
                            unsetVal(m, c.n);
                    }
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