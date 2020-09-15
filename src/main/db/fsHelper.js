// @flow

import fs from "fs";
import writeFileAtomic from "write-file-atomic";

export const readFile = (filePath: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const writeFile = (filePath: string, data: string) => writeFileAtomic(filePath, data);
