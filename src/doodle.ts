import * as https from 'https';
import * as _ from 'lodash';

// convert date to string
export const dates = (obj: any) => obj
  .options
  .map(o => (new Date(o.start)).toISOString())
  .map(s => s.substring(0, 10));
// get participant and convert preference to unavailable array
export const participants = (obj: any) => obj
  .participants
  .reduce((prev, next) => {
    prev[next.name] = {
      unavailable: next.preferences.reduce(
        (p, n, i) => {
          if (n == 0) p.push(i);
          return p;
        }, 
        []
      ),
      maybe: next.preferences.reduce(
        (p, n, i) => {
          if (n == 1) p.push(i);
          return p;
        }, 
        []
      ),
    };
    return prev;
  },      {});

// retrieve data from doodle site
export async function getDoodleResult(id: string = '8kzgfrq7y7t5cskt') {
  const get = (url: string) => new Promise<any>((resolve, reject) => {
    let result = [];
    https.get(url, (res) => {
      res.on('data', (data) => {
        result.push(data);
      });
      res.on('end', () => resolve(JSON.parse(Buffer.concat(result).toString('utf8'))));
      res.on('error', (err) => {
        if (err instanceof Error) {
          reject(err);
        } else {
          reject(new Error(err));
        }
      });
    });
  });
  const doodleUrl = `https://doodle.com/api/v2.0/polls/${id}`;

  return get(doodleUrl);
}
