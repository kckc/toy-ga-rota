var t = require('./index');

try
{
    if (t.verify([0,0],[0,0]) !== true)
        throw 't.verify([0,0],[0,0]) FAILED';
    if (t.verify([0,1],[1,0]) !== true)
        throw 't.verify([0,1],[1,0]) FAILED';
    if (t.verify([0,1],[0,1]) !== false)
        throw 't.verify([0,1],[0,1]) FAILED';
    if (t.verify([1,1],[1,1]) !== false)
        throw 't.verify([1,1],[1,1]) FAILED';

    var ts = t.generateSolution(1, 1);
    if (ts.length !== 1)
        throw 'should generate solution of length 1';
    if (ts !== [1])
        throw 'expect array of 1';
}
catch(e)
{
    console.log(e);
}
finally
{
    console.log('test finished');
}