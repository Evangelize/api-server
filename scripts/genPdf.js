const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const resultPath = path.join(__dirname, 'result.pdf');
const pdfjs = require('pdfjs');
const notoSansRegular = fs.readFileSync(path.join(__dirname, '../vendors/fonts/NotoSans.ttf'));
const notoSansBold = fs.readFileSync(path.join(__dirname, '../vendors/fonts/NotoSans-Bold.ttf'));
const font = {
  notosans: {
    regular: pdfjs.createTTFFont(notoSansRegular),
    bold: pdfjs.createTTFFont(notoSansBold),
  },
};
let doc = pdfjs.createDocument(
  {
    font: font.notosans.regular,
    width: 792,
    height: 612,
    padding: 20,
    threshold: 20,
  }
);
const styles = {
  header: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 1.2,
    font: font.notosans.bold,
  },
  classTitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 1.0,
    font: font.notosans.bold,
  },
  std: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 1.0,
    font: font.notosans.regular,
  },
};
let table = doc.table(
  {
    width: 396,
    height: 113,
    padding: 2,
    borderWidth: 2,
    borderColor: 0x000000,
    widths: ['100%'],
  }
);

let tr = table.tr({ borderBottomWidth: 0 });
let td = tr.td();
td.text('Class Name', styles.header).br();
tr = table.tr({ borderTopWidth: 1, borderBottomWidth: 0 });
td = tr.td();
td.text().br();
td.text('Sunday Night', styles.classTitle).br();
td.text('Teacher 1', styles.std).br();
td.text('Teacher 1', styles.std).br();
tr = table.tr({ borderTopWidth: 1, borderBottomWidth: 0 });
td = tr.td();
td.text().br();
td.text('Wednesday Night', styles.classTitle).br();
td.text('Teacher 1', styles.std).br();
td.text('Teacher 1', styles.std).br().br();
tr = table.tr({ borderTopWidth: 1 });
td = tr.td();
td.text('First Last', styles.std).br();
td.text('First Last', styles.std).br();
td.text('First Last', styles.std).br();
td.text('First Last', styles.std).br();
td.text('First Last', styles.std).br();

const result = doc.render().toString();
// console.log(result);
fs.writeFileSync(resultPath, result, 'binary');
