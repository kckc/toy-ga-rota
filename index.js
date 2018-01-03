
// improvement
// - use lodash
// - use byte array

var ava = [
    [0,0,1,0],
    [1,1,0,1],
    [0,0,0,0],
    [1,0,0,0]
];

// constraints
// 1) must suit avalibility
// 2) index 0,1 cannot both be 1
// 3) each column has 1 value

// optimise
// each section lower better

var constraints1 = ava.reduce(function(prev, curr) {
    return prev.concat(curr);
}, []);

var constraints2 = [1,1,0,0];

var generation = 0,
    colonySize = 10,
    survive = 2,
    deceased = 2;

var gen0 = generateSolutions(10);

console.log(gen0);

var score0 = gen0.map(function(g){return calculateScore(g,ava[0].length,ava.length)});

console.log(score0);



/*======== Functions ============*/

function generateSolutions(count)
{
    var sols = [];
    for (var i=0; i<count; i++)
    {
        var solution = generateSolution(constraints1.length, ava[0].length);
        while(!verifyconstraints1(solution, constraints1)
            || !verifyconstraints2(solution, constraints2)
            || !verifyconstraints3(solution, ava[0].length))
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

function verifyconstraints2(solution, constraints)
{
    var currIndex = 0;
    while(currIndex<solution.length/constraints.size)
    {
        var test = getUnit(solution, currIndex, constraints.size);
        currIndex ++;
        result = test.map(function(obj, i) { return obj & constraints2[i];});
        if (result.toString() === constraints2.toString()) return false;
    }
    return true;
}

function verifyconstraints3(solution, unitSize)
{
    for (var i=0; i<unitSize; i++)
    {
        var columnCount = solution.reduce(function(prev, curr, j){
            if (j % unitSize === i)
                return prev + curr;
            else
                return prev;
        }, 0);
        
        if (columnCount > 1) return false;
    }
    return true;
}

function getUnit(solution, currentIndex, size)
{
    var test = [];
    for(var i=0; i<size; i++)
    {
        test.push(solution[currentIndex * size + i]);
    }
    return test;
}

function calculateScore(solution, unitSize, unitCount)
{
    var currIndex = 0;
    var score = 0;
    while(currIndex < solution.length/unitSize)
    {
        var unit = getUnit(solution, currIndex, unitSize);
        var count = unit.reduce(function(a,b) {return a+b;},0);
        score += Math.pow(Math.abs(count - solution.length/unitCount/unitCount), 2);
        currIndex++;
    }
    return score;
}

function crossover(solution1, solution2)
{

}

function pickBest(count)
{

}

function pickWorse(count)
{

}

exports.generateSolution = generateSolution;
exports.verify = verifyconstraints1;
exports.verify2 = verifyconstraints2;