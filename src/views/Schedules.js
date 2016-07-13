import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import DashboardMedium from '../components/DashboardMedium';
import ReactGridLayout from 'react-grid-layout';
import Slider from 'react-slick';
import * as Colors from 'material-ui/styles/colors';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import CardTitle from 'material-ui/Card/CardTitle';
import DropDownMenu from 'material-ui/DropDownMenu';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader/Subheader';
import Divider from 'material-ui/Divider';
import MediaQuery from 'react-responsive';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../components/NavToolBar';
import DisplayDivisionClasses from '../components/DisplayDivisionClasses';

@connect
class Schedules extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    const { classes } = this.context.state;

    this.setState({
      fixedHeader: true,
      fixedFooter: true,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      height: '300px',
      adjustForCheckbox: false,
      displaySelectAll: false,
      academicYear: null,
      divisionConfigs: [],
      divisionConfig: null,
      divSchedules: [],
      division: null,
      schedule: null,
      divisionYears: [],
      snackBar: {
        autoHideDuration: 2500,
        message: "No teacher selected",
        action: "Add Teacher",
        selectedItem: null
      }
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { classes } = this.context.state;
    let self = this;
    classes.getDivisionConfigs().then(
      function(data) {
        self.setState(
          {
            divisionConfigs: data,
            divisionConfig: data[0].id
          }
        );
        return classes.getCurrentDivisionYear(data[0].id);
      }
    ).then(
      function(data) {
        self.setState(
          {
            year: data,
            academicYear: data.id
          }
        );
        return classes.getDivisionSchedules(self.state.divisionConfig, self.state.year.id);
      }
    ).then(
      function(data) {
        self.setState(
          {
            divSchedules: data
          }
        );
        return classes.getCurrentDivisionSchedule(self.state.divisionConfig, self.state.year.id);
      }
    ).then(
      function(data) {
        self.setState(
          {
            schedule: data,
            division: data.id
          }
        );
        return classes.getDivisionYears(self.state.divisionConfig);
      }
    ).then(
      function(data) {
        self.setState(
          {
            divisionYears: data
          }
        );
      }
    );
  }

  selectedYear(event, selectedIndex, value) {
    let self = this;
    this.setState({academicYear: value});
    classes.getDivisionYears(this.state.divisionConfig).then((data) => self.setState({divisionYears: value}));
  }

  selectedDivisionConfig(event, selectedIndex, value) {
    let self = this;
    this.setState({divisionConfig: value});
    //console.log(menuItem);
  }

  selectedDivision(event, selectedIndex, value) {
    const { classes } = this.context.state;
    let self = this;
    this.setState({
      division: value
    });
    classes.getDivisionSchedule(value, self.state.academicYear).then(
      function(data) {
        self.setState(
          {
            schedule: data
          }
        );
      }
    );
    //console.log(menuItem);
  }

  formatDateRange(division) {
    return moment(division.start).format("MMM D YYYY") + " - " + moment(division.end).format("MMM D YYYY")
  }

  getLeftIcon(day) {
    //console.log("getLeftIcon", day);
    if (day.viewing) {
      return (<ContentAdd />);
    } else {
      return (<ContentRemove />);
    }
  }

  confirmTeacher(divClass, classDay, teacher, event) {
    const { classes } = this.context.state;
    const { params } = this.props;
    let opts,
        confirmed = !teacher.divClassTeacher.confirmed;
    classes.confirmTeacher(confirmed, divClass.divisionClass.id, teacher.divClassTeacher.id);
  }

  itemSelected(item, type, e) {
    console.log(item, type);
    let state = {};
    state[type] = item.id;
    this.setState(state);
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  render() {
    const { classes } = this.context.state;
    const { configs, ...props } = this.props,
          iconButtonElement = (
            <IconButton
              touch={true}
              tooltip="more"
              tooltipPosition="bottom-left">
              <MoreVertIcon color={Colors.grey400} />
            </IconButton>
          ),
          tableStyle={
            displayRowCheckbox: false,
            deselectOnClickaway: true,
            stripedRows: false,
            showRowHover: false,
            fixedHeader: true,
            fixedFooter: true,
            selectable: false,
            multiSelectable: false,
            enableSelectAll: false,
            height: '300px',
            adjustForCheckbox: false,
            displaySelectAll: false
          };
    //console.log("render", configs.data.data);
    let gridLayout = {
          className: "layout",
          isDraggable: false,
          isResizable: false,
          cols: 12,
          rowHeight: 50
        },
        grid = {
          width: '100%',
          height: '100%',
          overflowY: 'auto'
        },
        tileDay = {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: Colors.grey300,
          borderLeft: "1px solid "+ Colors.grey400
        },
        tileClassName = {
          padding: "2%",
          display: "table",
          width: "100%"
        },
        tileTeacher = {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          borderLeft: "1px solid "+ Colors.grey400
        },
        stripe = {
          backgroundColor: Colors.grey100
        },
        settings = {
          arrows: false,
          dots: false,
          infinite: true,
          speed: 500,
          slidesToShow: 4,
          responsive: [
            { breakpoint: 9999, settings: { slidesToShow: 3, arrows: false } },
            { breakpoint: 1700, settings: { slidesToShow: 2, arrows: false } },
            { breakpoint: 1025, settings: { slidesToShow: 1, arrows: false } }
          ]
        },
        divisionOptions = [
          { payload: 'children', text: 'Children' },
          { payload: 'adult', text: 'Adult' }
        ],
        filterOptions = [
          { payload: '2015', text: 'AY 2015' },
          { payload: '2016', text: 'AY 2016' },
          { payload: '2017', text: 'AY 2017' },
          { payload: '2018', text: 'AY 2018' },
        ],
        iconMenuItems = [
          { payload: '1', text: 'Download' },
          { payload: '2', text: 'More Info' }
        ],
        iconMenuStyle = {
          float: 'right',
          verticalAlign: 'top'
        },
        divisionYears = [];
  
    //console.log("academicYear", this.state.academicYear);
    if (window) {
      const { innerWidth } = window;
      const { responsive } = settings;

      const correctSettings = responsive.reduce(
        (previous = { breakpoint: 0 }, current) =>
          previous.breakpoint > innerWidth &&
          current.breakpoint > innerWidth &&
          previous.breakpoint > current.breakpoint ?
            current : previous
      );

      settings = { ...settings, ...correctSettings.settings };
    }
    return (
      <Grid fluid={true}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <MediaQuery query='(min-device-width: 1024px)'>
              <NavToolBar navLabel="Schedules" goBackTo="/dashboard">
                <ToolbarGroup key={2} lastChild={true} float="right">
                  <DropDownMenu value={this.state.divisionConfig} ref="divisionConfig" onChange={::this.selectedDivisionConfig} style={{marginRight: "12px"}}>
                    {this.state.divisionConfigs.map((config, index) =>
                      <MenuItem key={index} value={config.id} label={config.title} primaryText={config.title}/>
                    )}
                  </DropDownMenu>
                  <DropDownMenu ref="academicYear" value={this.state.academicYear} onChange={::this.selectedYear} style={{marginRight: "0px"}} >
                    {this.state.divisionYears.map((year, index) =>
                      <MenuItem key={index} value={year.id} label={moment(year.startDate).format("YYYY")} primaryText={moment(year.startDate).format("YYYY")}/>
                    )}
                  </DropDownMenu>
                  <DropDownMenu ref="divisions" value={this.state.division} onChange={::this.selectedDivision} style={{marginRight: "0px"}} >
                    {this.state.divSchedules.map((div, index) =>
                      <MenuItem key={index} value={div.id} label={div.title} primaryText={div.title}/>
                    )}
                  </DropDownMenu>
                  <ToolbarSeparator />
                  <RaisedButton label="Manage Schedules" secondary={true} />
                </ToolbarGroup>
              </NavToolBar>
            </MediaQuery>
            <MediaQuery query='(max-device-width: 1023px)'>
               <NavToolBar navLabel="Schedules" goBackTo="/dashboard">
                  <ToolbarGroup key={2} lastChild={true}>
                    <IconMenu
                      iconButtonElement={<IconButton touch={true}><NavigationExpandMoreIcon /></IconButton>}
                      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                      targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    >
                      <MenuItem
                        primaryText="Class Grouping"
                        rightIcon={<ArrowDropRight />}
                        menuItems={::this.state.divisionConfigs.map((config, index) =>
                            <MenuItem 
                              checked={(this.state.divisionConfig === config.id) ? true : false}
                              key={config.id} 
                              value={config.id} 
                              label={config.title} 
                              primaryText={config.title} 
                              onClick={((...args)=>this.itemSelected(config, 'divisionConfig', ...args))} />,
                          )
                        }
                      />

                      <MenuItem
                        primaryText="Year"
                        rightIcon={<ArrowDropRight />}
                        menuItems={this.state.divisionYears.map((year, index) =>
                            <MenuItem
                              checked={(this.state.academicYear === year.id) ? true : false}
                              key={year.id} 
                              value={year.id} 
                              label={moment(year.startDate).format("YYYY")} 
                              primaryText={moment(year.startDate).format("YYYY")}
                              onClick={((...args)=>this.itemSelected(year, 'academicYear', ...args))} />,
                          )
                        }
                      />

                      <MenuItem
                        primaryText="Quarter"
                        rightIcon={<ArrowDropRight />}
                        menuItems={this.state.divSchedules.map((div, index) =>
                          <MenuItem
                            checked={(this.state.division === div.id) ? true : false}
                            key={div.id} 
                            value={div.id} 
                            label={div.title} 
                            primaryText={div.title}
                            onClick={((...args)=>this.itemSelected(div, 'division', ...args))} />,
                          )
                       }
                      />
                      <Divider />
                      <MenuItem value="manage-schedules" primaryText="Manage Schedules" />
                    </IconMenu>
                  </ToolbarGroup>
              </NavToolBar>
            </MediaQuery>
          </Col>
        </Row>
        <Row>
              {this.state.schedule &&
              <Col xs={12} sm={12} md={12} lg={12}>
                <div style={{marginBottom: "10px"}}>
                  <Card>
                    <CardHeader
                      title={this.state.schedule.title}
                      subtitle={this.formatDateRange(this.state.schedule)}
                      avatar={<Avatar>Q{this.state.schedule.position}</Avatar>}>
                    </CardHeader>
                    <CardMedia>
                      <MediaQuery query='(min-device-width: 1024px)'>
                        <div>
                          <DisplayDivisionClasses type="table" tableStyle={tableStyle} division={this.state.schedule} />
                        </div>
                      </MediaQuery>
                      <MediaQuery query='(max-device-width: 1023px)'>
                        <div>
                          <Divider />
                          <DisplayDivisionClasses type="list" division={this.state.schedule} />
                        </div>
                      </MediaQuery>
                    </CardMedia>
                  </Card>
                </div>
              </Col>
              }
        </Row>
      </Grid>
    );
  }
}

export default Schedules;
