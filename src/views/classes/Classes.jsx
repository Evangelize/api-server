import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import ListClasses from '../../components/ListClasses';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  toggle: {

  },
};

@inject('classes')
@observer
class Classes extends Component {
  @observable sortable = false;

  formatDateRange(division) {
    return moment(division.start).format('MMM D YYYY') + ' - ' + moment(division.end).format('MMM D YYYY')
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  goBack() {
    this.context.router.goBack();
  }

  toggleSortable = () => {
    this.sortable = !this.sortable;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Classes" goBackTo="/dashboard">
                <ToolbarGroup key={3} style={{ float: "right" }} lastChild>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Toggle
                      label="Sortable"
                      labelPosition="right"
                      style={styles.toggle}
                      onToggle={((...args) => this.toggleSortable(...args))}
                      toggled={this.sortable}
                    />
                  </div>
                  <RaisedButton
                    label="Add Class"
                    secondary
                    onClick={this.handleNewClass}
                  />
                </ToolbarGroup>
              </NavToolBar>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={"Classes"}
                  subtitle={"All classes"}
                  avatar={<Avatar>{"C"}</Avatar>}
                />
                <CardMedia>
                  <ListClasses sortable={this.sortable} />
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Classes;
