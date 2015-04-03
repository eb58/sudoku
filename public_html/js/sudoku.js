/* global sudokuSolver */
// http://www.sudokubum.com/
var einfach = '200863000000012590108094600003000180701000030609020007030647000060158002500000804';
var schwer_ = '850002090000007080000006020102080005000060009008090004709100300040300100510000907';
var expert1 = '091407008074030000080020900020040006000200500800500001037010052410009300608000000';
var expert2 = '020005000015000000000008703051000000009700010000300046000080001700930060000000408';
var expert3 = '000710500702000000000090180040006090900000050307004000060000002000870000508000003';
var unbest_ = '123456789456789123789123456214365978000000000000000000000000000000000000000000000';
var extrem  = '000700620400090050009008070090080740000060000025070030040600200060050004013009000';

var sudoku = function(){
   function init(s){
      var res= [];
      s.split('').forEach( function(v,i){
         res[i] = Number(v);
      });
      return res;
   }
   
    function dump(msg,fld) {
      var s = '';
      fld.forEach(function(v){s+=v;});
      console.log( msg + ':' + s + '\n');
   }
   
   function doit( s ){
      var fld = init(s);
      dump( 'IN ', fld);
      var res = sudokuSolver(fld).solve();
      dump( 'OUT', res);
   }
   return {
      doit : doit
   };
};

sudoku().doit(einfach);
sudoku().doit(expert1);
sudoku().doit(expert2);
sudoku().doit(expert3);
sudoku().doit(extrem);
