import api from '../api';
import * as types from '../constants';

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

export function addTodo(text) {
  return { type: types.ADD_TODO, text };
}

export function completeTodo(index) {
  return { type: types.COMPLETE_TODO, index };
}

export function setVisibilityFilter(filter) {
  return { type: types.SET_VISIBILITY_FILTER, filter };
}

function receivePeople(people) {
  return {
    type: types.RECEIVE_PEOPLE,
    people: people
  }
}

export function getPeople(key, filter) {
  return {
    type: types.RECEIVE_PEOPLE,
    payload: {
      promise: api.people.get(key, filter)
    }
  };
}

export function setPerson(id, index, key, value) {
  return {
    type: types.UPDATE_PERSON,
    payload: {
      promise: api.people.set(id, index, key, value)
    }
  };
}

export function getDivisionsConfigs() {
  return {
    type: types.GET_DIVISION_CONFIGS,
    payload: {
      promise: api.divisions.getConfigs()
    }
  };
}

export function manageDivisionClassTeacher(type, divisionConfigId, yearId, divisionId, divisionClassId, day, personId, opts=null) {
  return {
    type: types.UPDATE_DIVISION_CLASS_TEACHER,
    payload: {
      promise: api.classes.manageTeacher(type, divisionConfigId, yearId, divisionId, divisionClassId, day, personId, opts)
    }
  };
}

export function updateClassAttendance(divisionClassId, day, attendanceDate, count) {
  return {
    type: types.UPDATE_DIVISION_CLASS_ATTENDANCE,
    payload: {
      promise: api.classes.updateClassAttendance(divisionClassId, day, attendanceDate, count)
    }
  };
}

export function divisionClassAttendanceAction(type, oldObj, newObj) {
  type = type.toUpperCase() + "_DIVISION_CLASS_ATTENDANCE";
  return {
    type: types[type],
    old: oldObj,
    new: newObj
  };
}

export function updateClassAttendanceLocal(divisionClass) {
  return {
    type: types.UPDATE_DIVISION_CLASS_ATTENDANCE_FULFILLED,
    payload: {
      data: divisionClass
    }
  };
}

export function updateNote(note, changes) {
  return {
    type: types.UPDATE_NOTE,
    payload: {
      promise: api.notes.update(note, changes)
    }
  };
}

export function addNote(note) {
  return {
    type: types.ADD_NOTE,
    payload: {
      promise: api.notes.add(note)
    }
  };
}
