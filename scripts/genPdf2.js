const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const resultPath = path.join(__dirname, 'result.pdf');

const fonts = {
  NotoSans: {
    normal: path.join(__dirname, '../vendors/fonts/NotoSans.ttf'),
    bold: path.join(__dirname, '../vendors/fonts/NotoSans-Bold.ttf'),
  },
};

const PdfPrinter = require('pdfmake/src/printer');
const printer = new PdfPrinter(fonts);
const docDefinition = {
  pageSize: 'LETTER',
  pageOrientation: 'landscape',
  pageMargins: [5, 40, 5, 40],
  content: [
    {
      columns: [
        {
          width: '48%',
          style: 'tableExample',
          layout: 'noBorders',
          table: {
            widths: ['100%'],
            body: [
              [
                {
                  style: 'classTitle',
                  text: 'Class Name',
                },
              ],
              [
                {
                  stack: [
                    {
                      style: 'day',
                      decoration: 'underline',
                      text: 'Sunday Morning',
                    },
                    {
                      style: 'std',
                      text: 'Teacher 1',
                    },
                    {
                      style: 'std',
                      text: 'Teacher 2',
                    },
                  ],
                },
              ],
              [
                {
                  stack: [
                    {
                      style: 'day',
                      decoration: 'underline',
                      text: 'Wednesday Evening',
                    },
                    {
                      style: 'std',
                      text: 'Teacher 1',
                    },
                    {
                      style: 'std',
                      text: 'Teacher 2',
                    },
                  ],
                },
              ],
              [
                {
                  style: 'students',
                  stack: [
                    {
                      style: 'std',
                      text: 'Student 1',
                    },
                    {
                      style: 'std',
                      text: 'Student 2',
                    },
                    {
                      style: 'std',
                      text: 'Student 3',
                    },
                    {
                      style: 'std',
                      text: 'Student 4',
                    },
                    {
                      style: 'std',
                      text: 'Student 5',
                    },
                  ],
                },
              ],
            ],
          },
        },
        {
          width: '2%',
          canvas: [
            {
              type: 'line',
              x1: 15, y1: 0,
              x2: 15, y2: 530,
              lineWidth: 1,
            },
          ],
        },
      ],
    },
  ],
  styles: {
    classTitle: {
      alignment: 'center',
      fontSize: 22,
      bold: true,
      margin: [0, 0, 0, 10],
    },
    day: {
      alignment: 'center',
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5],
    },
    std: {
      alignment: 'center',
    },
    students: {
      margin: [0, 10, 0, 0],
    },
    tableExample: {
      margin: [0, 0, 0, 0],
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black',
    },
  },
  defaultStyle: {
    font: 'NotoSans',
  },
};

const pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream(resultPath));
pdfDoc.end();
