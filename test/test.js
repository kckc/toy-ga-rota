const sampleSolution = [ 'Ken',
'Alex',
'SiuWan',
'Andy',
'ShuangYing',
'Alex',
'Michael',
'SiuWan',
'ChenDong',
'Ken',
'Kel',
'Michael',
'Minnie',
'Andy',
'ShuangYing',
'Teeda',
'Kel',
'Matthew',
'Andy',
'Roco',
'Alex',
'Teeda',
'Matthew',
'ChenDong',
'Roco',
'Teeda',
'Matthew',
'SiuWan',
'Ken',
'Roco',
'Matthew',
'Horace',
'Minnie',
'Ken',
'ShuangYing',
'Horace',
'Kel',
'Minnie',
'ChenDong',
'Ken',
'Kel',
'Alex',
'Michael',
'Andy',
'ShuangYing',
'Horace',
'Kel',
'Minnie',
'ChenDong',
'Roco',
'Horace',
'Alex',
'Minnie',
'ChenDong',
'Roco',
'Michael',
'Teeda',
'SiuWan',
'Andy',
'ShuangYing' ]

var p = require("../bin/people");

// console.log(p.roles);

var u = require("../bin/util");

// console.log(u.padName("abc"));

// console.log(u.padName("awej"));

// console.log(u.padName("reewrwrew"));

var s = require('../bin/scoring');
 
// console.log(s.lessConsecativeDays(sampleSolution));

var v = require('../bin/validation');

console.log(v.validateAll(sampleSolution));
