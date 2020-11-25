import fs from "fs";
import path from "path";

export default {
  dump: (filename, data) => {
    fs.writeFileSync(path.resolve(`/app/tests/tmp/${filename}`), JSON.stringify(data));
  },
};
