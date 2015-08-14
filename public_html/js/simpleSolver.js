var simpleSolver = (function () {
    var DIM = 9;
    var DIMSQRT = Math.sqrt(DIM); //3
    var DIMSQR = DIM * DIM; //  81
    var FLDSINBLK = _.range(DIM).map(function (b) {
        return _.range(DIM).map(function (n) {
            return ([0, 3, 6, 27, 30, 33, 54, 57, 60])[b] + ([0, 1, 2, 9, 10, 11, 18, 19, 20])[n];
        });
    });
    var FLDSINROW = _.range(DIM).map(function (r) {
        return _.range(DIM).map(function (c) {
            return c + r * DIM;
        });
    });
    var FLDSINCOL = _.range(DIM).map(function (c) {
        return _.range(DIM).map(function (r) {
            return c + r * DIM;
        });
    });

    function ok(fld, n, v) {
        var r = Math.floor(n / DIM);
        var c = n % DIM;
        var b = Math.floor(r / DIMSQRT) * DIMSQRT + Math.floor(c / DIMSQRT);

        for (var i = 0; i < FLDSINROW[r].length; i++) {
            if (fld[FLDSINCOL[r][i]] === v)
                return false;
        }
        for (var i = 0; i < FLDSINCOL[c].length; i++) {
            if (fld[FLDSINCOL[c][i]] === v)
                return false;
        }
        for (var i = 0; i < FLDSINBLK[b].length; i++) {
            if (fld[FLDSINBLK[b][i]] === v)
                return false;
        }
        return true;
    }

    function solve(vec) { // sudoku as array fld = [ 0, 3, 5, ...]
        var fld = _.extend([], vec);
        var all = _.range(DIMSQR).map(function (n) {
            return n;
        });
        var empty = _.filter(all, function (i) {
            return fld[i] === 0;
        });
        //return fld;
        for (var i = 0; i < empty.length; ) {
            var found = false;
            var n = empty[i];
            var v = fld[n] + 1;
            console.log('i', i, ' n:', n);
            while (!found && v <= DIM) {
                if (!ok(fld,n, v)) {
                    v++;
                } else {
                    found = true;
                    fld[n] = v;
                    i++;
                }
            }
            if (!found) {
                fld[n   ] = 0;
                i--;
            }
        }
        return fld;
    }
    return {
        solve: solve
    };
});


