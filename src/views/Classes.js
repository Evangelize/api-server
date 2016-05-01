import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import connect from '../components/connect';
import { browserHistory } from 'react-router';
import DashboardMedium from '../components/DashboardMedium';
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
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

@connect(state => ({
  classes: state.classes
}))
@observer
class Classes extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
  
  }

  componentDidMount() {

  }

  formatDateRange(division) {
    return moment(division.start).format("MMM D YYYY") + " - " + moment(division.end).format("MMM D YYYY")
  }

  navigate(path, e) {
    browserHistory.push(path);
  }
  
  handleNewClass(){
    
  }

  render() {
    const { classes, ...props } = this.props;
    return (
      <div>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <nav className={"grey darken-1"}>
                <div className={"nav-wrapper"}>
                  <div style={{margin: "0 0.5em"}}>
                    <a href="#!" onTouchTap={((...args)=>this.navigate("/dashboard", ...args))} className={"breadcrumb"}>Dashboard</a>
                    <a className={"breadcrumb"}>Classes</a>
                  </div>
                </div>
              </nav>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Toolbar style={{justifyContent: "flex-end"}}>
                <ToolbarGroup key={1} float={"right"} lastChild={true}>
                  <RaisedButton
                    label="Add Class"
                    secondary={true}
                    onTouchTap={::this.handleNewClass}
                  />
                </ToolbarGroup>
              </Toolbar>
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
                  <List>
                    {::classes.getClasses().map((cls, index) =>
                      <div
                        key={index} >
                        <Divider />
                        <ListItem
                          onTouchTap={((...args)=>this.navigate("/classes/"+cls.id, ...args))}
                          primaryText={cls.title}
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

export default Classes;
