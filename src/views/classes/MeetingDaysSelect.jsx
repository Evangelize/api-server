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
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';

@inject('classes')
@observer
class MeetingDaysSelect extends Component {
  @observable year;

  componentWillMount() {
    const { classes, params } = this.props;
    const { yearId } = params;
    this.year = classes.getClassGroupingYear(yearId);
  }

  handleSelect = (day, event, isInputChecked) => {
    const { classes, params } = this.props;
    const { yearId } = params;
    classes.updateAcademicYearMeetingDay(yearId, day, isInputChecked);
  }

  render() {
    const { classes, params } = this.props;
    const { yearId } = params;
    const meetingDays = classes.getAcademicYearMeetingDays(yearId).map(obj => obj.dow);
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar
                navLabel={`AY ${moment(this.year.endDate).format('YYYY')} - Class Meeting Days`}
                goBackTo={`/schedule/${this.year.divisionConfigId}`}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={"Select Meeting Days"}
                  subtitle={`AY ${moment(this.year.endDate).format('YYYY')}`}
                  avatar={<Avatar>D</Avatar>}
                />
                <CardMedia>
                  <List>
                    {[...Array(7)].map((x, i) =>
                      <div key={i}>
                        <Divider />
                        <ListItem
                          leftCheckbox={
                            <Checkbox
                              checked={meetingDays.indexOf(i) > -1}
                              onCheck={((...args) => this.handleSelect(i, ...args))}
                            />
                          }
                          primaryText={moment().day(i).format('dddd')}
                        />
                      </div>
                    )}
                  </List>
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default MeetingDaysSelect;
