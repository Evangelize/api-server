import {
  observable,
  autorun,
  computed,
  toJS,
  action
} from 'mobx';
import {
  filter,
  sortBy,
  orderBy,
  first,
  map,
  reverse,
  find,
  uniqueId,
  pick,
  uniqBy
} from 'lodash/fp';
import moment from 'moment-timezone';
import waterfall from 'async/waterfall';
import change from 'percent-change';
import Promise from 'bluebird';

export default class Jobs {
  @observable db;
  @observable events;

  constructor(db, events) {
    if (db) {
      this.setupDb(db);
    }
    if (events) {
      this.setupEvents(events);
    }
  }

  setupDb(db) {
    this.db = db;
  }

  setupEvents(events) {
    this.events = events;
  }

  isNumeric(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  }

  @action updateCollectionFields(collection, id, updates) {
    return this.db.updateCollectionFields(collection, id, updates);
  }

  @action deleteRecord(collection, id) {
    return this.db.deleteRecord(collection, id);
  }

  getJobs() {
    return this.db.store(
      'jobs',
      [
        filter((rec) => rec.deletedAt === null),
        orderBy(['priority', 'title'], ['asc']),
      ]
    );
  }

  getJob(id) {
    return this.db.store(
      'jobs',
      [
        filter((rec) => rec.deletedAt === null && rec.id === id),
        first,
      ]
    );
  }

  getJobMembers(id) {
    const jobMembers = this.db.store(
      'memberJobPreferences', [
        filter((rec) => rec.deletedAt === null && rec.jobId === id),
      ]
    );
    const members = jobMembers.map((rec) => rec.personId);
    const people = this.db.store(
      'people', [
        filter((rec) => rec.deletedAt === null &&
          members.indexOf(rec.id) > -1
        ),
        uniqBy('id'),
        orderBy(['lastName', 'firstName'], ['asc']),
      ]
    );
    people.forEach((person, index) => {
      const job = jobMembers.filter((rec) => rec.personId === person.id);
      if (job.length) {
        people[index].job = job[0];
      }
    });
    return people;
  }

  getWorshipServiceJobs(serviceId) {
    const serviceJobs = this.db.store(
      'worshipServiceJobs',
      [
        filter((rec) => rec.deletedAt === null && rec.worshipServiceId === serviceId),
      ]
    );
    const serviceJobIds = serviceJobs.map((rec) => rec.jobId);
    const jobs = this.db.store(
      'jobs',
      [
        filter((rec) => rec.deletedAt === null &&
          serviceJobIds.indexOf(rec.id) > -1),
        orderBy(['priority', 'title'], ['asc']),
      ]
    );

    jobs.forEach((job, index) => {
      const serviceJob = serviceJobs.filter((rec) => rec.jobId === job.id);
      if (serviceJob.length) {
        jobs[index].serviceJob = serviceJob[0];
      }
    });
    return jobs;
  }

  getServiceJobMembersCount(serviceId, jobId, date) {
    const assignments = this.db.store(
      'memberJobAssignments',
      [
        filter((rec) => rec.deletedAt === null &&
          rec.worshipServiceId === serviceId &&
          rec.jobId === jobId &&
          rec.assignmentDate === date
        ),
      ]
    );

    return assignments.length;
  }

  getServiceJobMembers(serviceId, jobId, date) {
    let members = [];
    const job = this.db.store(
      'jobs',
      [
        filter((rec) => rec.deletedAt === null &&
          rec.id === jobId),
        first,
      ]
    );

    const assignments = this.db.store(
      'memberJobAssignments',
      [
        filter((rec) => rec.deletedAt === null &&
          rec.worshipServiceId === serviceId &&
          rec.jobId === jobId &&
          rec.assignmentDate === date
        ),
      ]
    );
    if (assignments) {
      const personIds = assignments.map((rec) => rec.personId);
      members = this.db.store(
        'people',
        [
          filter((rec) => rec.deletedAt === null &&
            personIds.indexOf(rec.id) > -1),
          orderBy(['lastName', 'firstName'], ['asc']),
        ]
      );
    }
    const missingAssignments = job.numPeople - members.length;
    const defaultArr = Array.from(Array(missingAssignments), (x, i) => {
      return {
        id: null,
        firstName: 'No member assigned',
      };
    });
    members = members.concat(defaultArr);
    return members;
  }

  getServiceJobMember(personId, serviceId, jobId, date) {
    return this.db.store(
      'memberJobAssignments',
      [
        filter((rec) => rec.deletedAt === null &&
          rec.personId === personId &&
          rec.worshipServiceId === serviceId &&
          rec.jobId === jobId &&
          rec.assignmentDate === date
        ),
        first,
      ]
    );
  }

  @action updateJobPriority(id, currentPos, newPos) {
    let record = this.db.store(
      'jobs', [
        filter((rec) => rec.deletedAt === null && rec.id === id),
        first,
      ]
    );
    if (record) {
      record = record.valueOf();
      record.priority = newPos;
      this.db.updateStore('jobs', record, false);
    }
  }

  @action updateJob(id, data, add) {
    let retVal = null;
    const ts = moment();
    if (add) {
      const newRecord = Object.assign(
        {},
        {
          id: null,
          revision: null,
          createdAt: ts,
          updatedAt: ts,
          deletedAt: null,
        },
        data,
      );
      retVal = this.db.updateStore('jobs', newRecord, false);
    } else {
      const record = this.db.store(
        'jobs', [
          filter((rec) => rec.deletedAt === null &&
            rec.id === id
          ),
          first,
        ]
      );
      if (record) {
        retVal = this.deleteRecord('jobs', record.id);
      }
    }
    return retVal;
  }

  @action addJobMember(jobId, personId, confirmed) {
    let retVal = null;
    const ts = moment();
    const newRecord = {
      id: null,
      jobId,
      personId,
      confirmed,
      revision: null,
      createdAt: ts,
      updatedAt: ts,
      deletedAt: null,
    };
    retVal = this.db.updateStore('memberJobPreferences', newRecord, false);
    return retVal;
  }

  @action confirmMember(confirmed, jobId, personId) {
    let record = this.db.store(
      'memberJobPreferences', [
        filter((rec) => rec.deletedAt === null && rec.jobId === jobId && rec.personId === personId),
        first,
      ]
    );
    if (record) {
      record = record.valueOf();
      record.confirmed = confirmed;
      this.db.updateStore('memberJobPreferences', record, false);
    }
  }

  @action deleteJobMember(jobId, personId) {
    let retVal;
    const record = this.db.store(
      'memberJobPreferences', [
        filter((rec) => rec.deletedAt === null && rec.jobId === jobId && rec.personId === personId),
        first,
      ]
    );
    if (record) {
      retVal = this.deleteRecord('memberJobPreferences', record.id);
    }

    return retVal;
  }

  @action updateWorshipServiceJob(worshipServiceId, jobId, checked) {
    let newRecord;
    let retVal;
    const ts = moment();
    const record = this.db.store(
      'worshipServiceJobs', [
        filter((rec) => rec.deletedAt === null && rec.worshipServiceId === worshipServiceId &&
          rec.jobId === jobId),
        first,
      ]
    );
    if (checked) {
      if (!record) {
        newRecord = Object.assign(
          {},
          {
            id: null,
            entityId: null,
            jobId,
            worshipServiceId,
            day: null,
            title: null,
            confirm: true,
            priority: 100,
            numPeople: 1,
            revision: null,
            createdAt: ts,
            updatedAt: ts,
            deletedAt: null,
          }
        );
      } else {
        newRecord = Object.assign(
          {},
          toJS(record),
          {
            jobId,
            worshipServiceId,
            active: true,
          }
        );
      }
      retVal = this.db.updateStore('worshipServiceJobs', newRecord, false);
    } else if (record) {
      retVal = this.deleteRecord('worshipServiceJobs', record.id, false);
    }
    return retVal;
  }

  @action updateMemberJobAssignment(job, service, date, oldPerson, newPerson) {
    let retVal = null;
    let newRecord;
    const ts = moment();
    const record = (oldPerson.id) ? this.db.store(
      'memberJobAssignments', [
        filter((rec) => rec.deletedAt === null && 
          rec.worshipServiceId === service.id &&
          rec.jobId === job.id &&
          rec.personId === oldPerson.id
        ),
        first,
      ]
    ) : null;
    if (!record) {
      newRecord = Object.assign(
        {},
        {
          id: null,
          revision: null,
          createdAt: ts,
          updatedAt: ts,
          deletedAt: null,
        },
        {
          worshipServiceId: service.id,
          personId: newPerson.id,
          assignmentDate: date,
          day: null,
          jobId: job.id,
        }
      );
      retVal = this.db.updateStore('memberJobAssignments', newRecord, false);
    } else {
      newRecord = Object.assign(
        {},
        toJS(record),
        {
          worshipServiceId: service.id,
          personId: newPerson.id,
          assignmentDate: date,
          day: null,
          jobId: job.id,
        }
      );
      retVal = this.db.updateStore('memberJobAssignments', newRecord, false);
    }
    return retVal;
  }
}
