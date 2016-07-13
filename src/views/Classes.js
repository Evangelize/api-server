import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import async from 'async';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import DashboardMedium from '../components/DashboardMedium';
import ListClasses from '../components/ListClasses';
import ReactGridLayout from 'react-grid-layout';
import Styles from 'material-ui/styles';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import CardTitle from 'material-ui/Card/CardTitle';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Toggle from 'material-ui/Toggle';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import NavToolBar from '../components/NavToolBar';
import { Grid, Row, Col } from 'react-bootstrap';

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

@connect
class Classes extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.setState({
      sortable: false
    });
  }

  componentDidMount() {

  }

  formatDateRange(division) {
    return moment(division.start).format("MMM D YYYY") + " - " + moment(division.end).format("MMM D YYYY")
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  goBack() {
    this.context.router.goBack();
  }
  
  handleNewClass(){
    
  }

  toggleSortable() {
    this.setState({
      sortable: !this.state.sortable
    });
  }

  render() {
    const { classes } = this.context.state;
    return (
      <div>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Classes" goBackTo="/dashboard">
                <ToolbarGroup key={3} float={"right"} lastChild={true}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <Toggle
                      label="Sortable"
                      labelPosition="right"
                      style={styles.toggle}
                      onToggle={((...args)=>this.toggleSortable())}
                      toggled={this.state.sortable}
                    />
                  </div>
                  <RaisedButton
                    label="Add Class"
                    secondary={true}
                    onClick={::this.handleNewClass}
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
                  avatar={<Avatar>{"C"}</Avatar>}>
                </CardHeader>
                <CardMedia>
                  <ListClasses sortable={this.state.sortable}/>
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
