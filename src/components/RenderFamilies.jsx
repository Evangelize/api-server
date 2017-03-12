import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader/Subheader';
import DisplayFamily from './DisplayFamily';

@inject('classes')
@observer
class RenderFamilies extends Component {
  render() {
    const { families, classes, onTap } = this.props;
    let retVal;
    if (families.length > 0) {
      retVal = (
        <List>
          {families.map((family) =>
            <DisplayFamily
              family={family}
              key={family.id}
              secondaryText={
                <div>
                  <p>
                    {family.familyName}
                  </p>
                  <p>
                    {family.address1}
                  </p>
                </div>
              }
              secondaryTextLines={2}
              onTap={onTap}
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
export default RenderFamilies;
