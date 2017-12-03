import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import moment from 'moment-timezone';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import ListClasses from '../../components/ListClasses';

@inject('classes')
@observer
class DivisionClassesSelect extends Component {
  @observable divisionId;
  handleSelect = (id, event, isInputChecked) => {
    const { classes, params } = this.props;
    const { divisionId } = params;
    classes.updateDivisionClass(id, divisionId, isInputChecked);
  }

  render() {
    const { classes, params } = this.props;
    const { divisionId } = params;
    const div = classes.getDivision(divisionId);
    const year = classes.getClassGroupingYear(div.divisionYear);
    const divClasses = classes.getCurrentDivisionClasses(divisionId).map(obj => obj.classId);
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar
                navLabel={`${div.title} AY ${moment(year.endDate).format('YYYY')}`}
                goBackTo={`/schedule/academicYearDivision/${div.id}`}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={'Select Division Classes'}
                  subtitle={`${moment(div.start).format('MMM DD YYYY')} - ${moment(div.end).format('MMM DD YYYY')}`}
                  avatar={<Avatar>{`${div.title.charAt(0)}${div.position + 1}`}</Avatar>}
                />
                <CardMedia>
                  <ListClasses
                    type="add"
                    selected={divClasses}
                    onSelect={this.handleSelect}
                  />
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default DivisionClassesSelect;
