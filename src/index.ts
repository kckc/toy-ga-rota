import {main, printSolution} from './main'
import * as doodle from './doodle'
import * as program from 'commander'

program.version(process.version)
program
    .command('doodle <hash>')
    .action(async (hash) => {
        const res = await doodle.getDoodleResult(hash);
        const data = {
            dates: doodle.dates(res),
            people: doodle.participants(res),
        }
        console.log(JSON.stringify(data))
    })

program
    .command('run')
    .action(() => {
        const winner = main();
        printSolution(winner);
    })

program.parse(process.argv);
