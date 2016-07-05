import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import async from 'async';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import DashboardMedium from '../components/DashboardMedium';
import ReactGridLayout from 'react-grid-layout';
import Styles from 'material-ui/styles';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import CardTitle from 'material-ui/Card/CardTitle';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MenuItem from 'material-ui/MenuItem';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';
import { getDivisionsConfigs } from '../actions';
import NavToolBar from '../components/NavToolBar';
import DatePicker from 'material-ui/DatePicker';
import * as Colors from 'material-ui/styles/colors';

@connect
class Attendance extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.setState({
      start: moment(moment().format("YYYY-MM-01")+" 00:00:00").subtract(3, "month").valueOf(),
      end: moment(moment().format("YYYY-MM-01")+" 00:00:00").add(1, "month").valueOf()
    });
  }

  componentDidMount() {

  }


  handleEditAttendance(day, index, e) {
    const { configs } = this.props;
    //let db = spahql.db(configs.data);
    let path = "/attendance/" + day.date;
    this.navigate(path);
  }

  changeDate(type, ...args) {
    console.log(args);
    let state = {};
    state[type] = moment(args[1]).valueOf();
    this.setState(state);
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  render() {
    const { classes } = this.context.state;
    console.log(moment(this.state.start).format("M/D/YYYY"), moment(this.state.end).format("M/D/YYYY"));
    return (
      <div>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Attendance" goBackTo="/dashboard">
                <ToolbarGroup key={2} lastChild={true}>
                  <IconMenu
                    iconButtonElement={<IconButton touch={true}><NavigationExpandMoreIcon /></IconButton>}
                    anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  >
                    <MenuItem
                      primaryText={"Start Date: "+ moment(this.state.start).format("MMMM Do YYYY")}
                    />

                   <MenuItem
                      primaryText={"End Date: "+ moment(this.state.end).format("MMMM Do YYYY")}
                    />
                  </IconMenu>
                </ToolbarGroup>
              </NavToolBar>
            </Col>
          </Row>
          <Row>
            
            <Col xs={12} sm={6} md={6} lg={6}>
              <DatePicker
                hintText="Start Date"
                floatingLabelText="Start Date"
                value={moment(this.state.start).toDate()}
                onChange={((...args)=>this.changeDate("start", ...args))}
              />
            </Col>
            <Col xs={12} sm={6} md={6} lg={6}>
              <DatePicker
                hintText="End Date"
                floatingLabelText="End Date"
                value={moment(this.state.end).toDate()}
                onChange={((...args)=>this.changeDate("end", ...args))}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={"Children Attendance"}
                  subtitle={"Daily Totals"}
                  avatar={<Avatar>{"C"}</Avatar>}>
                </CardHeader>
                <CardMedia>
                  <List>
                    {classes.getDailyAttendance(this.state.start, this.state.end).map((day, index) =>
                      <div key={index}>
                        <Divider />
                        <ListItem
                          key={index}
                          rightAvatar={<Avatar>{day.count}</Avatar>}
                          onTouchTap={((...args)=>this.handleEditAttendance(day, index, ...args))}
                          primaryText={moment(day.date, "x").format("dddd")}
                          secondaryText={moment(day.date, "x").format("MMMM Do YYYY")} />
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

export default Attendance;
