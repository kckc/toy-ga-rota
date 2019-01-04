import * as https from 'https';
import { promisify } from 'util';

// convert date to string
exports.dates = (obj) => obj.options.map(o => (new Date(o.start)).toISOString()).map(s => s.substring(0,10))
// get participant and convert preference to unavailable array
exports.participants = (obj) => obj.participants.reduce((prev, next) => {prev[next.name] = next.preferences.reduce((p,n,i)=>{if(n < 2) p.push(i); return p},[]); return prev},{})

// retrieve data from doodle site
export async function getDoodleResult(id: string = '8kzgfrq7y7t5cskt') {
    const get = (url) => new Promise((resolve, reject) => {
        let result;
        https.get(url, res => {
            res.on('data', data => {
                if (data) result += data;
            });
            res.on('end', () => resolve(JSON.parse(result)));
            res.on('error', err => {
                if (err instanceof Error) {
                    reject(err);
                } else {
                    reject(new Error(err));
                }
            })
        })
    })
    const doodleUrl = 'https://doodle.com/api/v2.0/polls/' + id;

    return get(doodleUrl);
}
