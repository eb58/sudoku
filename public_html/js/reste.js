 var FLDSINROW = _.range(DIM).map(function (r) {
        return _.range(DIM).map(function (c) {
            return c + r * DIM;
        });
    });
    var FLDSINCOL = _.range(DIM).map(function (c) {
        return _.range(DIM).map(function (r) {
            return c + r * DIM;
        });
    });/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function findHiddenNaked(m) {
        return findHN(m, FLDSINBLK);// || findHN(m, FLDSINCOL) || findHN(m, FLDSINROW);
    }


   var dump = function dump(m) {
        var s = '';
        for (var i = 0; i < 81; i++) {
            s += (i % 9 === 0 ? '\n' : '') + sprintf("[%s] %-13s ", m.fld[i], !m.cand || m.cand[i] === undefined ? "" : m.cand[i]);
        }
        console.log(s);
    };