import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import DropDownMenu from 'material-ui/DropDownMenu';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Popover from 'material-ui/Popover';
import MediaQuery from 'react-responsive';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import DisplayDivisionClasses from '../../components/DisplayDivisionClasses';

@inject('classes')
@observer
class Schedules extends Component {
  @observable openMenu = false;
  @observable anchorEl = {};
  @observable division;
  @observable academicYear;
  @observable divisionConfig;

  componentWillMount() {
    const { classes } = this.props;
    const divisionConfigs = classes.getDivisionConfigs();
    const year = (divisionConfigs.length) ? classes.getCurrentDivisionYear(divisionConfigs[0].id) : [];
    const division = (year) ? classes.getCurrentDivisionSchedule(year.id) : null;
    this.academicYear = (year) ? year.id : null;
    this.divisionConfig = (divisionConfigs.length) ? divisionConfigs[0].id : null;
    this.division = (division) ? division.id : null;

    this.setState({
      fixedHeader: true,
      fixedFooter: true,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      height: '300px',
      adjustForCheckbox: false,
      displaySelectAll: false,
      schedule: null,
      snackBar: {
        autoHideDuration: 2500,
        message: 'No teacher selected',
        action: 'Add Teacher',
        selectedItem: null,
      },
    });
  }

  selectedYear = (event, selectedIndex, value) => {
    const { classes } = this.props;
    this.academicYear = value;
    const divisions = classes.getDivisionSchedules(value);
    this.division = (divisions.length > 0) ? divisions[0].id : null;
  }

  selectedDivisionConfig = (event, selectedIndex, value) => {
    const { classes } = this.props;
    this.divisionConfig = value;
    const year = classes.getCurrentDivisionYear(value);
    const division = (year) ? classes.getCurrentDivisionSchedule(year.id) : null;
    this.academicYear = (year) ? year.id : null;
    this.division = (division) ? division.id : null;
  }

  selectedDivision = (event, selectedIndex, value) => {
    this.division = value;
  }

  formatDateRange(division) {
    return moment(division.start).format('MMM D YYYY') + ' - ' + moment(division.end).format('MMM D YYYY');
  }

  confirmTeacher(divClass, classDay, teacher, event) {
    const { classes } = this.props;
    const confirmed = !teacher.divClassTeacher.confirmed;
    classes.confirmTeacher(confirmed, divClass.divisionClass.id, teacher.divClassTeacher.id);
  }

  itemSelected = (item, type, e) => {
    console.log(item, type);
    this[type] = item.id;
  }

  goToManageSchedule = (e) => {
    browserHistory.push('/schedule/manage');
  }

  handleOpenMenu = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.openMenu = true;
    this.anchorEl = event.currentTarget;
  }

  handleRequestClose = () => {
    this.openMenu = false;
  }

  printPlacards = (event) => {
    const url = `/api/print/division/${this.division}/placards`;
    window.open(url, '_blank');
  }

  render() {
    const { configs, classes } = this.props;
    const tableStyle = {
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
      displaySelectAll: false,
    };

    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <MediaQuery query="(min-device-width: 1024px)">
              <NavToolBar navLabel="Schedules" goBackTo="/dashboard">
                <ToolbarGroup key={2} lastChild style={{ float: 'right' }}>
                  <DropDownMenu value={this.divisionConfig} ref="divisionConfig" onChange={this.selectedDivisionConfig} style={{ marginRight: '12px' }}>
                    {classes.getDivisionConfigs().map((config) =>
                      <MenuItem key={config.id} value={config.id} label={config.title} primaryText={config.title} />
                    )}
                  </DropDownMenu>
                  <DropDownMenu ref="academicYear" value={this.academicYear} onChange={this.selectedYear} style={{ marginRight: '0px' }} >
                    {classes.getClassGroupingYears(this.divisionConfig).map((year) =>
                      <MenuItem key={year.id} value={year.id} label={moment(year.endDate).format('YYYY')} primaryText={moment(year.endDate).format('YYYY')} />
                    )}
                  </DropDownMenu>
                  <DropDownMenu ref="divisions" value={this.division} onChange={this.selectedDivision} style={{ marginRight: '0px' }} >
                    {classes.getDivisionSchedules(this.academicYear).map((div, index) =>
                      <MenuItem key={div.id} value={div.id} label={div.title} primaryText={div.title} />
                    )}
                  </DropDownMenu>
                  <ToolbarSeparator />
                  <RaisedButton
                    label="Manage Schedules"
                    secondary
                    onTouchTap={this.goToManageSchedule}
                  />
                  <Popover
                    open={this.openMenu}
                    anchorEl={this.anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    onRequestClose={this.handleRequestClose}
                  >
                    <Menu>
                      <MenuItem value="new" primaryText="Add New Academic Year" />
                      <MenuItem value="edit" primaryText="Edit Academic Years" />
                    </Menu>
                  </Popover>
                  <RaisedButton
                    label="Print"
                    secondary
                    onTouchTap={this.printPlacards}
                  />
                </ToolbarGroup>
              </NavToolBar>
            </MediaQuery>
            <MediaQuery query="(max-device-width: 1023px)">
              <NavToolBar navLabel="Schedules" goBackTo="/dashboard">
                <ToolbarGroup key={2} lastChild>
                  <IconMenu
                    iconButtonElement={<IconButton touch><NavigationExpandMoreIcon /></IconButton>}
                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                  >
                    <MenuItem
                      primaryText="Class Grouping"
                      rightIcon={<ArrowDropRight />}
                      menuItems={classes.getDivisionConfigs().map((config, index) =>
                        <MenuItem
                          checked={(this.divisionConfig === config.id) ? true : false}
                          key={config.id}
                          value={config.id}
                          label={config.title}
                          primaryText={config.title}
                          onClick={((...args) => this.itemSelected(config, 'divisionConfig', ...args))}
                        />,
                      )}
                    />

                    <MenuItem
                      primaryText="Year"
                      rightIcon={<ArrowDropRight />}
                      menuItems={classes.getClassGroupingYears(this.divisionConfig).map((year) =>
                          <MenuItem
                            checked={(this.academicYear === year.id) ? true : false}
                            key={year.id}
                            value={year.id}
                            label={moment(year.startDate).format('YYYY')}
                            primaryText={moment(year.startDate).format('YYYY')}
                            onClick={((...args) => this.itemSelected(year, 'academicYear', ...args))} />,
                        )
                      }
                    />

                    <MenuItem
                      primaryText="Quarter"
                      rightIcon={<ArrowDropRight />}
                      menuItems={classes.getDivisionSchedules(this.divisionConfig, this.academicYear).map((div, index) =>
                        <MenuItem
                          checked={(this.division === div.id) ? true : false}
                          key={div.id}
                          value={div.id}
                          label={div.title}
                          primaryText={div.title}
                          onClick={((...args) => this.itemSelected(div, 'division', ...args))} />,
                        )
                      }
                    />
                    <Divider />
                    <MenuItem
                      value="manage-schedules"
                      primaryText="Manage Schedules"
                      onTouchTap={this.goToManageSchedule}
                    />
                  </IconMenu>
                </ToolbarGroup>
              </NavToolBar>
            </MediaQuery>
          </Col>
        </Row>
        <Row>
          {this.division &&
            <Col xs={12} sm={12} md={12} lg={12}>
              <div style={{ marginBottom: '10px' }}>
                <Card>
                  <CardHeader
                    title={(this.division) ? classes.getDivision(this.division).title : ''}
                    subtitle={(this.division) ? this.formatDateRange(classes.getDivision(this.division)) : ''}
                    avatar={<Avatar>Q{(this.division) ? classes.getDivision(this.division).position + 1 : ''}</Avatar>}
                  />
                  <CardMedia>
                    <MediaQuery query="(min-device-width: 1024px)">
                      <div>
                        <DisplayDivisionClasses
                          type="table"
                          tableStyle={tableStyle}
                          division={classes.getDivision(this.division)}
                        />
                      </div>
                    </MediaQuery>
                    <MediaQuery query="(max-device-width: 1023px)">
                      <div>
                        <Divider />
                        <DisplayDivisionClasses
                          type="list"
                          division={classes.getDivision(this.division)}
                        />
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
