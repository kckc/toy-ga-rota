
// improvement
// - use lodash
// - use byte array

var ava = [
    [0,0,1],
    [1,1,0],
    [0,0,0]
];

// constraints
// 1) must suit avalibility
// 2) index 0,1 cannot both be 1

// optimise
// each section lower better

var constraints1 = ava.reduce(function(prev, curr) {
    return prev.concat(curr);
}, []);


var gen0 = generateSolutions(10);

console.log(gen0);

function generateSolutions(count)
{
    var sols = [];
    for (var i=0; i<count; i++)
    {
        var solution = generateSolution(constraints1.length, ava[0].length);
        while(!verifyconstraints1(solution, constraints1)
            || !verifyconstraints2(solution))
        {
            solution = generateSolution(constraints1.length, ava[0].length);
        }
        sols.push(solution);
    }
    return sols;
}

function generateSolution(length, pointCount)
{
    var array = [];

    for (var i=0; i<length; i++)
        array.push(0);
    
    for (var i=0; i<pointCount; i++)
    {
        var done = false;
        while(!done)
        {
            var position = Math.floor(Math.random() * length);
            if(array[position] === 0)
            {
                array[position] = 1;
                done = true;
            }
        }
    }

    return array;
}

function verifyconstraints1(solution, constraints)
{
    return solution.reduce(function(prev, curr, i) {
        return prev + (curr & constraints[i]);
    }, 0) < 1;
}

function verifyconstraints2(solution, constarints)
{
    
    var constraints2 = [1,1,0];
    var currIndex = 0;
    while(currIndex<solution.length)
    {
        var test = [];
        for(var i=0; i<constraints2.length; i++)
        {
            test.push(solution[currIndex]);
            currIndex++;
        }
        result = test.map(function(obj, i) { return obj & constraints2[i];});
        if (result.toString() === constraints2.toString()) return false;
    }
    return true;
}

function calculateScore(solution)
{

}

exports.generateSolution = generateSolution;
exports.verify = verifyconstraints1;
exports.verify2 = verifyconstraints2;