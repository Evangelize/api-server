import Joi from 'joi';
import _ from 'lodash';
import moment from 'moment-timezone';
import async from 'async';
import iouuid from 'innodb-optimized-uuid';
import api from '../src/lib/server';
import models from '../src/models';
import utils from '../src/lib/utils';
import fs from 'fs';
import path from 'path';
import PdfPrinter from 'pdfmake/src/printer';
const prefix = '/api/print';

module.exports = [
  {
    method: 'GET',
    path: `${prefix}/division/{id}/placards`,
    handler: (request, reply) => {
      const divPlacard = {
        division: null,
        meetingDays: null,
        classes: null,
      };
      const id = request.params.id;
      const fonts = {
        NotoSans: {
          normal: path.join(__dirname, '../vendors/fonts/NotoSans.ttf'),
          bold: path.join(__dirname, '../vendors/fonts/NotoSans-Bold.ttf'),
        },
      };

      const printer = new PdfPrinter(fonts);
      const docDefinition = {
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        pageMargins: [20, 40, 20, 40],
        content: [],
        styles: {
          classTitle: {
            alignment: 'center',
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 10],
          },
          day: {
            alignment: 'center',
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5],
          },
          student: {
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
          tablePlacard: {
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
      const finish = (pdf) => {
        reply(pdf)
        .type('application/pdf')
        .header('Content-Disposition', 'attachment; filename="placard.pdf"')
        .header('Content-Length', pdf.length)
        .encoding('binary');
      };
      const genPdf = () => {
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        let chunks = [];
        let result;

        pdfDoc.on('data', (chunk) => {
          chunks.push(chunk);
        });
        pdfDoc.on('end', () => {
          result = Buffer.concat(chunks);
          finish(result);
        });
        pdfDoc.end();
      };

      // getByDivisionClassDay(divisionId, classId, day)

      const printClasses = () => {
        const numClasses = divPlacard.classes.length;
        let placard = 1;
        let page = {
          columns: [],
        };
        async.eachSeries(
          divPlacard.classes,
          (cls, callback) => {
            const fragment = {
              width: '50%',
              style: 'tablePlacard',
              layout: {
                hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 2 : 1,
                vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length) ? 2 : 1,
                hLineColor: (i, node) => (i === 0 || i === node.table.body.length) ? 'black' : 'white',
                vLineColor: (i, node) => (i === 0 || i === node.table.widths.length) ? 'black' : 'white',
              },
              table: {
                widths: ['97%'],
                height: (i) => {
                  let height = 1;
                  if (i === 0) {
                    height = 40;
                  } else if (i === 1 || i === 2) {
                    height = 80;
                  } else if (i === 3) {
                    height = 280;
                  }
                  console.log('row', i, height);
                  return height;
                },
                body: [
                ],
              },
            };
            async.waterfall(
              [
                (cb) => {
                  api.classes.get(cls.classId)
                  .then((result) => {
                    fragment.table.body.push(
                      [
                        {
                          style: 'classTitle',
                          text: result.title,
                        },
                      ]
                    );
                    cb(null, result);
                  });
                },
                (data, cb) => {
                  async.eachSeries(
                    divPlacard.meetingDays,
                    (day, cback) => {
                      let stack = [
                        {
                          stack: [],
                        },
                      ];
                      stack[0].stack.push(
                        {
                          style: 'day',
                          decoration: 'underline',
                          text: moment()
                                .weekday(day.dow)
                                .format('dddd')
                                .toUpperCase() + ' TEACHER',
                        }
                      );
                      api.divisionClassTeachers
                      .getByDivisionClassDay(cls.id, day.dow)
                      .then((teachers) => {
                        async.each(
                          teachers,
                          (teacher, cback1) => {
                            stack[0].stack.push(
                              {
                                style: 'std',
                                text: `${teacher.firstName} ${teacher.lastName}`,
                              }
                            );
                            cback1(null);
                          },
                          (err) => {
                            fragment.table.body.push(stack);
                            cback(null);
                          }
                        );
                      });
                    },
                    (err) => {
                      cb(null, data);
                    }
                  );
                },
                (data, cb) => {
                  let stack = [
                    {
                      style: 'students',
                      stack: [],
                    },
                  ];
                  stack[0].stack.push(
                    {
                      style: 'student',
                      text: 'STUDENTS',
                    }
                  );
                  api.yearClassStudents
                  .getByClassYear(divPlacard.division.divisionYear, data.id)
                  .then((students) => {
                    async.each(
                      students,
                      (student, cback) => {
                        stack[0].stack.push(
                          {
                            style: 'std',
                            text: `${student.firstName} ${student.lastName}`,
                          }
                        );
                        cback(null);
                      },
                      (err) => {
                        fragment.table.body.push(stack);
                        cb(null);
                      }
                    );
                  });
                },
              ],
              (result, err) => {
                if (placard % 2 === 0) {
                  // console.log('page:', placard / 2, ' column:', placard);
                  if (placard < numClasses) {
                    page.pageBreak = 'after';
                  }
                  page.columns.push(fragment);
                  docDefinition.content.push(page);
                  page = {
                    columns: [],
                  };
                } else {
                  // console.log('column:', placard);
                  page.columns.push(fragment);
                }
                placard = placard + 1;
                callback();
              }
            );
          },
          (err) => {
            genPdf();
          }
        );
      };

      api.divisions.get(id)
      .then((division) => {
        divPlacard.division = division;
        return api.divisionClasses.getByDivision(id);
      })
      .then((classes) => {
        divPlacard.classes = classes;
        return api.yearMeetingDays.getByYear(divPlacard.division.divisionYear);
      })
      .then((days) => {
        divPlacard.meetingDays = days;
        return;
      })
      .finally(() => {
        printClasses();
      });
    },
  },
];
