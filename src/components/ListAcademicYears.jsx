import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { List } from 'material-ui/List';
import AcademicYear from './AcademicYear';

@inject('classes')
@observer
class ListAcademicYears extends Component {
  render() {
    const { classes, classGroupingId, onEdit } = this.props;
    const retVal = (
      <List>
      {classes.getClassGroupingYears(classGroupingId).map((item) =>
        <AcademicYear key={item.id} item={item} onEdit={onEdit} />
      )}
      </List>
    );
    return retVal;
  }
}
export default ListAcademicYears;
