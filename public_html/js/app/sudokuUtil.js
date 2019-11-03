const bitmapAsString = cand => {
  if (cand === undefined)
    return '';
  const n = cand.vals;
  let vals = '';
  for (let v = 1; v <= 9; v++) {
    if (n & (1 << v))
      vals += v;
  }
  return vals;
};

const dump = m =>  {
  for (let i = 0, s = ''; i < 81; i++) {
    s += (i !== 0 && i % 9 === 0 ? '\n' : '') + sprintf("[%s] %-8s", m.fld[i], bitmapAsString(m.cand[i]));
  }
  console.log(s);
};