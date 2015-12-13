import { combineReducers } from 'redux';
import undoable, { distinctState } from 'redux-undo';
import { routeReducer as router } from 'redux-simple-router';
import spahql from 'spahql';

import { VisibilityFilters } from './actions';
import * as types from './constants';
import initialState from './initialState.js';

const { SHOW_ALL } = VisibilityFilters;

function todos(state = [], action) {
  switch (action.type) {
    case types.ADD_TODO:
      return [...state, {
        text: action.text,
        completed: false
      }];
    case types.COMPLETE_TODO:
      return [
        ...state.slice(0, action.index),
        Object.assign({}, state[action.index], {
          completed: true
        }),
        ...state.slice(action.index + 1)
      ];
    default:
      return state;
    }
}

function notes(state, action) {
  console.log("notes", state);
  let newstate = Object.assign({}, state);
  switch (action.type) {
    case types.GET_NOTES_FULFILLED:
      newstate.notes = {
        data: action.payload.notes,
        hydrated: true
      };
      return newstate.notes;
    default:
      return state || initialState().notes;
  }
}

function people(state, action) {
  console.log("people", state);
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
  console.log("divisionConfigs", state);
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
          db = spahql.db(newstate.data);
          divClass = db.select("/*[/id == "+action.payload.divisionConfigId+"]/divisionYears/*[/id == "+action.payload.yearId+"]/divisions/*[/id == "+action.payload.divisionId+"]/divisionClasses/*[/id == "+action.payload.divisionClassId+"]");
      divClass.replace(action.payload.data);
      return newstate;
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
  console.log("attendance", state);
  let newstate = Object.assign({}, state);
  switch (action.type) {
    case types.GET_ATTENDANCE_FULFILLED:
      newstate.attendance = {
        data: action.payload.attendance,
        hydrated: true
      };
      return newstate.attendance;
    case types.UPDATE_ATTENDANCE_FULFILLED:
      newstate.data.latest = action.payload.data;
      return newstate;
    default:
      return state || initialState().attendance;
  }
}

const app = combineReducers({
  routing: router,
  notes: undoable(notes, { filter: distinctState(), debug: true }),
  people: undoable(people, { filter: distinctState(), debug: true }),
  divisionConfigs: undoable(divisionConfigs, { filter: distinctState(), debug: true }),
  attendance: undoable(attendance, { filter: distinctState(), debug: true })
});

export default app;
