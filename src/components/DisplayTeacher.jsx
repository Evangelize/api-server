import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import DisplayPerson from './DisplayPerson';

@inject('classes')
@observer
class DisplayTeacher extends Component {
  @observable person;
  componentWillMount() {
    const { classes, teacher } = this.props;
    this.person = classes.getPerson(teacher.peopleId);
  }

  render() {
    const { teacher, secondaryText } = this.props;
    return (
      <DisplayPerson person={this.person} secondaryText={secondaryText} />
    );
  }
}
export default DisplayTeacher;
