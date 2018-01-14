import Promise from 'bluebird';
import moment from 'moment-timezone';
import async from 'async';
import iouuid from 'innodb-optimized-uuid';
import React from 'react';
import {
  Text,
  Document,
  Font,
  Page,
  StyleSheet,
  Image,
  View,
} from '@react-pdf/core';
import ReactPDF from '@react-pdf/node';
import api from '../src/lib/server';
import models from '../src/models';
import utils from '../src/lib/utils';
import fs from 'fs';
import path from 'path';
import pdfmake from 'pdfmake';
const prefix = '/api/print';

module.exports = [
  {
    method: 'GET',
    path: `${prefix}/division/{id}/placards`,
    handler: async (request, h) => {
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

      Font.register(path.join(__dirname, '../vendors/fonts/NotoSans.ttf'), {
        family: 'NotoSans',
      });
      Font.register(path.join(__dirname, '../vendors/fonts/NotoSans-Bold.ttf'), {
        family: 'NotoSans Bold',
      });

      const styles = StyleSheet.create({
        page: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        container: {
          flexDirection: 'column',
          alignItems: 'center',
          borderWidth: 3,
          borderColor: 'black',
          borderStyle: 'solid',
          width: 375,
          height: 500,
        },
        image: {
          marginBottom: 10,
        },
        header: {
          marginTop: 10,
          marginBottom: 8,
          fontSize: 15,
          fontFamily: 'NotoSans Bold',
          textAlign: 'center',
          textDecoration: 'underline',
          textTransform: 'uppercase',
        },
        list: {
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: 12,
          fontFamily: 'NotoSans',
          textAlign: 'center',
        },
        listItem: {
          flexDirection: 'row',
          alignItems: 'center',
          fontSize: 12,
          fontFamily: 'NotoSans',
          textAlign: 'center',
        },
        rightColumn: {
          flexDirection: 'column',
          flexGrow: 1,
          marginLeft: 15,
          marginRight: 30,
          marginTop: 20,
        },
        footer: {
          fontSize: 12,
          fontFamily: 'NotoSans Bold',
          align: 'center',
          marginTop: 25,
          marginHorizontal: 30,
          paddingVertical: 10,
          borderWidth: 3,
          borderColor: 'gray',
          borderStyle: 'dashed',
        },
        classTitle: {
          fontSize: 24,
          fontFamily: 'NotoSans Bold',
          marginBottom: 10,
        },
        teachers: {
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 4,
        },
        students: {
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 5,
        },
      });

      const getClassStudents = async (cls) => {
        const students = await api.yearClassStudents.getByClassYear(divPlacard.division.divisionYear, cls.classId);
        cls.students = students.map(s => s.get());
        return cls;
      };

      const getClassTeachersByDay = async (day) => {
        const teachers = await api.divisionClassTeachers.getByDivisionClassDay(day.class.id, day.dow);
        day.teachers = teachers;
        return day;
      };

      const getClassTeachers = async (cls) => {
        const days = await Promise.each(cls.days, getClassTeachersByDay);
        cls.days = days;
        return cls;
      };

      const getClass = async (cls) => {
        const classInfo = await api.classes.get(cls.classId);
        cls.class = classInfo.get();
        return cls;
      };

      // getByDivisionClassDay(divisionId, classId, day)
      divPlacard.division = await api.divisions.get(id);
      divPlacard.classes = await api.divisionClasses.getByDivision(id);
      divPlacard.meetingDays = await api.yearMeetingDays.getByYear(divPlacard.division.divisionYear);
      divPlacard.meetingDays = divPlacard.meetingDays.map(day => day.get()); 
      divPlacard.classes = divPlacard.classes.map(cls =>
        Object.assign(
          {},
          cls.get(),
          {
            days: divPlacard.meetingDays.map(d => Object.assign({}, d, { class: cls.get() })),
          },
        )
      );
      divPlacard.classes = await Promise.each(divPlacard.classes, getClass);
      divPlacard.classes = await Promise.each(divPlacard.classes, getClassTeachers);
      divPlacard.classes = await Promise.each(divPlacard.classes, getClassStudents);

      const Teachers = ({ cls, day }) => (
        <View style={styles.teachers}>
          <Text style={styles.header}>
            {moment().weekday(day.dow).format('dddd')} TEACHERS
          </Text>
          <View style={styles.list}>
            {day.teachers.map((teacher) => <Text style={styles.listItem} key={teacher.id}>{teacher.firstName} {teacher.lastName}</Text>)}
          </View>
        </View>
      );

      const Students = ({ students }) => (
        <View style={styles.students}>
          <Text style={styles.header}>
            STUDENTS
          </Text>
          <View style={styles.list}>
            {students.map((student) => <Text style={styles.listItem} key={student.id}>{student.firstName} {student.lastName}</Text>)}
          </View>
        </View>
      );

      const DocPage = ({ cls }) => (
        <Page size="LETTER" style={styles.page}>
          <View style={styles.container}>
            <Text style={styles.classTitle}>{cls.class.title}</Text>
            {cls.days.map((day) => <Teachers key={day.id} cls={cls} day={day} />)}
            <Students students={cls.students} />
          </View>
        </Page>
      );

      const PdfDocument = () => (
        <Document
          author="Evangelize"
          keywords="evangelize, placard, classes"
          subject="Class Placards"
          title="Class Placards"
        >
          {divPlacard.classes.map((cls) => <DocPage key={cls.id} cls={cls} />)}
        </Document>
      );
      
      try {
        const buffers = [];
        const stream = await ReactPDF.renderToStream(<PdfDocument />);
        return new Promise((resolve, reject) => {
          stream.on('data', (chunk) => { buffers.push(chunk); });
          stream.once('end', () => {
            const buffer = Buffer.concat(buffers);
            resolve(buffer.toString('base64'));
          });
          stream.once('error', (err) => {
            reject(err);
          });
        });
      } catch (e) {
        console.log(e);
      }
    },
  },
];
