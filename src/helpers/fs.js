// @flow

import fs from "fs";

const promisify = (fn: any) => (...args: any): Promise<any> =>
  new Promise((resolve, reject) =>
    fn(...args, (err: Error, res: any) => {
      if (err) return reject(err);
      return resolve(res);
    }),
  );

export const fsReadFile = promisify(fs.readFile);
export const fsReaddir = promisify(fs.readdir);
export const fsWriteFile = promisify(fs.writeFile);
export const fsMkdir = promisify(fs.mkdir);
export const fsUnlink = promisify(fs.unlink);
