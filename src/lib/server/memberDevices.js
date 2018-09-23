import models from '../../models';
import Promise from 'bluebird';

export default {
  all(entityId, lastUpdate) {
    const where = (lastUpdate) ? {
      updatedAt: {
        $gte: lastUpdate,
      },
    } : {};
    if (entityId) {
      where.entityId = entityId;
    }
    return models.MemberDevices.findAll({
      where,
      order: [
        ['updatedAt', 'DESC'],
      ],
    });
  },
  allPerson(personId, lastUpdate) {
    const where = (lastUpdate) ? {
      updatedAt: {
        $gte: lastUpdate,
      },
    } : {};
    if (personId) {
      where.personId = personId;
    }
    return models.MemberDevices.findAll({
      where,
      order: [
        ['updatedAt', 'DESC'],
      ],
    });
  },
  get(id, entityId) {
    const where = {
      id: new Buffer(id, 'hex'),
    };
    if (entityId) {
      where.entityId = new Buffer(entityId, 'hex');
    }
    return models.MemberDevices.findOne({ where });
  },
  getByDeviceId(deviceId) {
    const where = {
      deviceId,
    };
    return models.MemberDevices.findOne({ where });
  },
  insert(record) {
    const newrecord = Object.assign(
      {},
      record,
      {
        id: new Buffer(record.id, 'hex'),
        entityId: (record.entityId) ? new Buffer(record.entityId, 'hex') : null,
        personId: (record.personId) ? new Buffer(record.personId, 'hex') : null,
      }
    );

    return models.MemberDevices.create(
      newrecord
    );
  },
  update(record) {
    const newrecord = Object.assign(
      {},
      record,
      {
        id: new Buffer(record.id, 'hex'),
        entityId: (record.entityId) ? new Buffer(record.entityId, 'hex') : null,
        personId: (record.personId) ? new Buffer(record.personId, 'hex') : null,
      }
    );
    return models.MemberDevices.update(
      newrecord,
      {
        where: {
          id: newrecord.id,
        },
      }
    ).then(
      () => models.MemberDevices.findOne({
        where: {
          id: newrecord.id,
        },
      })
    );
  },
  delete(record) {
    return models.MemberDevices.destroy({
      where: {
        id: new Buffer(record.id, 'hex'),
      },
    });
  },
};
