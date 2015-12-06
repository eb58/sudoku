var bitmapAsString = function (cand) {
   if (cand === undefined)
      return '';
   var n = cand.vals;
   for (var v = 1, vals = ''; v <= 9; v++) {
      if (n & (1 << v))
         vals += v;
   }
   return vals;
};

var dump = function (m) {
   for (var i = 0, s = ''; i < 81; i++) {
      s += (i !== 0 && i %9 === 0 ? '\n' : '') + sprintf("[%s] %-8s", m.fld[i], bitmapAsString(m.cand[i]));
   }
   console.log(s);
};