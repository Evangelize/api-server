import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import DisplayPerson from './DisplayPerson';

@inject('classes')
@observer
class RenderPeople extends Component {
  render() {
    const { people } = this.props;
    const { classes } = this.props;
    let retVal;
    if (people.length > 0) {
      retVal = (
        <List>
          {people.map((person) =>
            <DisplayPerson
              person={person}
              key={person.id}
              secondaryText={
                <div>
                  <p>
                    {(classes.getFamily(person.familyId)) ? classes.getFamily(person.familyId).familyName : 'No Family'}
                  </p>
                  <p>
                    {person.emailAddress}
                  </p>
                </div>
              }
              secondaryTextLines={2}
            />
          )}
        </List>
      );
    } else {
      retVal = <div />;
    }
    return retVal;
  }
}
export default RenderPeople;
