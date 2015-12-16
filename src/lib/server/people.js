import models from '../../models';
import Promise from 'bluebird';

export default {
  find(field, term) {
    return new Promise(function(resolve, reject){
      models.People.findAll({
        where: models.sequelize.where(models.sequelize.col(field), 'LIKE', term+'%'),
        include: [
          {
            model: models.Teachers
          },
          {
            model: models.Students
          }
        ]
      }).then(
        function(people) {
          resolve( people );
          return null;
        },
        function(err){
          reject( err );
          return null;
        }
      )
    });
  }
};
