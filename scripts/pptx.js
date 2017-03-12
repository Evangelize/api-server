import PPTX from '../src/lib/pptx';
import fs from 'fs';
const path = process.argv[2];
const outPath = 'test-slide.json';

fs.readFile(path, (err, data) => {
  if (err) throw err;
  const pptx = new PPTX();
  pptx.parse(data).then(
    (results) => {
      fs.writeFile(
        outPath,
        JSON.stringify(results),
        (error) => {
          if (error) {
            console.error("write error:  " + error.message);
          } else {
            console.log("Successful Write to " + outPath);
          }
        }
      );
    }
  );
});