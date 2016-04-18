import { combineReducers } from 'redux';
import undoable, { distinctState } from 'redux-undo';
import { routeReducer as router } from 'redux-simple-router';
import * as iouuid from 'innodb-optimized-uuid';
import spahql from 'spahql';
import loki from 'lokijs';
import { VisibilityFilters } from './actions';
import * as types from './constants';
import initialState from './initialState.js';

const { SHOW_ALL } = VisibilityFilters;

function divisionClassAttendance(state, action) {
  //console.log("divisionClassAttendance", action, state);
  switch (action.type) {
    case types.INSERT_DIVISION_CLASS_ATTENDANCE:
      action.new.id = iouuid.generate();
      state.insert(action.new);
      return state;
    default:
      return state || initialState().divisionClassAttendance;
  }
}

function classes(state, action) {
  switch (action.type) {
    default:
      return state || initialState().classes;
  }
}

function classMeetingDays(state, action) {
  switch (action.type) {
    default:
      return state || initialState().classMeetingDays;
  }
}

function divisionClasses(state, action) {
  switch (action.type) {
    default:
      return state || initialState().divisionClasses;
  }
}

function divisionClassTeachers(state, action) {
  switch (action.type) {
    default:
      return state || initialState().divisionClassTeachers;
  }
}

function divisions(state, action) {
  switch (action.type) {
    default:
      return state || initialState().divisionClasses;
  }
}

function divisionYears(state, action) {
  switch (action.type) {
    default:
      return state || initialState().divisionClasses;
  }
}

function students(state, action) {
  switch (action.type) {
    default:
      return state || initialState().divisionClasses;
  }
}

function teachers(state, action) {
  switch (action.type) {
    default:
      return state || initialState().divisionClasses;
  }
}

function notes(state, action) {
  //console.log("notes", action, state);
  let newstate = Object.assign({}, state),
      db, record;
  switch (action.type) {
    case types.GET_NOTES_FULFILLED:
      newstate.notes = {
        data: action.payload.notes,
        hydrated: true
      };
      return newstate.notes;
    case types.ADD_NOTE_FULFILLED:
    case types.UPDATE_NOTE_FULFILLED:
      db = spahql.db(newstate.data);
      record = db.select("/*[/id == "+action.payload.data.id+"]");
      if (record.length) {
        record.replace(action.payload.data);
      } else {
        newstate.data.unshift(action.payload.data);
      }
      return newstate;
    default:
      return state || initialState().notes;
  }
}

function people(state, action) {
  //console.log("people", state);
  let newstate = Object.assign({}, state);
  switch (action.type) {
    case types.RECEIVE_PEOPLE_FULFILLED:
      newstate.people = action.payload;
      return newstate.people;
    case types.UPDATE_PERSON_FULFILLED:
      newstate.people.data[action.payload.index] = action.payload.data;
      return newstate.people;
    default:
      return state || initialState().people;
  }
}

function divisionConfigs(state, action) {
  //console.log("divisionConfigs", state);
  let newstate = Object.assign({}, state),
      db, divClass;
  switch (action.type) {
    case types.GET_DIVISION_CONFIGS_FULFILLED:
      newstate.divisionConfigs = {
        data: action.payload.divisionConfigs,
        hydrated: true
      };
      return newstate.divisionConfigs;
    case types.UPDATE_DIVISION_CLASS_TEACHER_FULFILLED:
    case types.UPDATE_DIVISION_CLASS_ATTENDANCE_FULFILLED:
      db = spahql.db(newstate.data);
      divClass = db.select("/*/divisionYears/*/divisions/*/divisionClasses/*[/id == "+action.payload.data.id+"]");
      divClass.replace(action.payload.data);
      return newstate;
    default:
      return state || initialState().divisionConfigs;
  }
}

function attendance(state, action) {
  //console.log("attendance", state);
  let newstate = Object.assign({}, state);
  switch (action.type) {
    case types.GET_ATTENDANCE_FULFILLED:
      newstate.attendance = {
        data: action.payload.attendance,
        hydrated: true
      };
      return newstate.attendance;
    case types.UPDATE_LATEST_ATTENDANCE_FULFILLED:
      newstate.data.latest = action.payload.data;
      return newstate;
    case types.UPDATE_AVG_ATTENDANCE_FULFILLED:
      newstate.data.average = action.payload.data;
      return newstate;
    default:
      return state || initialState().attendance;
  }
}

const app = combineReducers({
  routing: router,
  notes: notes,
  divisionClassAttendance: divisionClassAttendance,
  people: people,
  divisionClasses: divisionClasses,
  divisionClassTeachers: divisionClassTeachers,
  divisionConfigs: divisionConfigs,
  classMeetingDays: classMeetingDays,
  classes: classes,
  divisions: divisions,
  divisionYears: divisionYears,
  students: students,
  teachers: teachers
});

export default app;
