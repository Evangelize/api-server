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
import ListDivisionClasses from '../../components/ListDivisionClasses';
import DialogDivision from '../../components/DialogDivision';

@inject('classes')
@observer
class DivisionClasses extends Component {
  @observable divisionId;
  @observable title = '';
  @observable start = moment();
  @observable end = moment();
  @observable isEdit = false;
  @observable dialogOpen = false;
  handleChange = (type, e, date) => {
    if (type === 'start') {
      this.start = moment(date);
    } else if (type === 'end') {
      this.end = moment(date);
    } else {
      this.title = e.target.value;
    }
  }

  navigate = () => {
    const { classes, params } = this.props;
    const { divisionId } = params;
    const path = `/schedule/academicYearDivision/${divisionId}/select`;
    browserHistory.push(path);
  }

  handleEdit = (id) => {
    const { classes } = this.props;
    const div = classes.getDivision(id);
    this.isEdit = true;
    this.divisionId = id;
    this.title = div.title;
    this.start = moment(div.start);
    this.end = moment(div.end);
    this.dialogOpen = true;
  }

  render() {
    const { classes, params } = this.props;
    const { divisionId } = params;
    const div = classes.getDivision(divisionId);
    const year = classes.getClassGroupingYear(div.divisionYear);
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar
                navLabel={`${div.title} AY ${moment(year.endDate).format('YYYY')}`}
                goBackTo={`/schedule/academicYear/${div.divisionYear}`}
              >
                <ToolbarGroup key={3} style={{ float: 'right' }} lastChild>
                  <RaisedButton
                    label="Select Class(es)"
                    secondary
                    onClick={this.navigate}
                  />
                </ToolbarGroup>
              </NavToolBar>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={"Division Classes"}
                  subtitle={`${moment(div.start).format('MMM DD YYYY')} - ${moment(div.end).format('MMM DD YYYY')}`}
                  avatar={<Avatar>{`${div.title.charAt(0)}${div.position + 1}`}</Avatar>}
                />
                <CardMedia>
                  <ListDivisionClasses
                    divisionId={divisionId}
                    onEdit={this.handleEdit}
                  />
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
        <DialogDivision
          open={this.dialogOpen}
          isEdit={this.isEdit}
          title={this.title}
          start={this.start}
          end={this.end}
          onClose={this.handleClose}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default DivisionClasses;
