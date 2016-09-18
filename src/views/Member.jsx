import React, { Component } from 'react';
import moment from 'moment-timezone';
import momentFquarter from 'moment-fquarter';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import Masonry from 'react-masonry-component';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import DropDownMenu from 'material-ui/DropDownMenu';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../components/NavToolBar';
import MaskedInput from '../components/MaskedInput';

const style = {
  marginLeft: 20,
};

const dropDownStyle = Object.assign(
  {},
  style,
  {
    boxSizing: 'border-box',
  },
);

const toggleStyle = Object.assign(
  {},
  style,
  {
    width: 'calc(98% - 21px)',
    height: '51px',
    marginTop: '21px',
  },
);

@inject('classes')
@observer
class Member extends Component {
  @observable member;
  @observable family;
  @observable slideIndex = 'information';
  componentWillMount() {
    const { classes, params } = this.props;
    this.member = classes.getPerson(params.id);
    this.family = classes.getFamily(this.member.familyId);
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  handleChange = (field, e) => {
    const { classes } = this.props;
    let record = {};
    record[field] = e.target.value;
    classes.db.updateCollectionFields('people', this.member.id, record);
  }

  handleChangeSelect = (field, e, key, payload) => {
    const { classes } = this.props;
    let record = {};
    record[field] = payload;
    classes.db.updateCollectionFields('people', this.member.id, record);
  }

  

  handleChangeDate = (field, ...args) => {
    const { classes } = this.props;
    let record = {};
    record[field] = moment(args[1]).valueOf();
    classes.db.updateCollectionFields('people', this.member.id, record);
  }

  handleChangeToggle = (field, ...args) => {
    const { classes } = this.props;
    let record = {};
    console.log(args);
    record[field] = (args[1]);
    classes.db.updateCollectionFields('people', this.member.id, record);
  }

  updateTitle(e) {
    const { classes } = this.props;
    const { params } = this.props;
    classes.db.updateCollectionFields('classes', params.classId, { title: e.target.value });
  }

  changeTab = (index) => {
    if (typeof index === 'string') this.slideIndex = index;
  }

  render() {
    const { classes } = this.props;
    let retVal;
    if (this.member) {
      retVal = (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Members" goBackTo="/members" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={`${this.member.lastName}, ${this.member.firstName}`}
                  subtitle={this.family.familyName}
                  avatar={<Avatar>{this.member.firstName.charAt(0)}</Avatar>}
                />
                <CardMedia>
                  <Tabs
                    value={this.slideIndex}
                    onChange={this.changeTab}
                  >
                    <Tab
                      label="Information"
                      value={'information'}
                    >
                      <TextField
                        floatingLabelText="First Name"
                        value={this.member.firstName}
                        onChange={((...args) => this.handleChange('firstName', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                      <Divider />
                      <TextField
                        floatingLabelText="Last Name"
                        value={this.member.lastName}
                        onChange={((...args) => this.handleChange('lastName', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                      <Divider />
                      <MaskedInput
                        floatingLabelText="Work Phone"
                        value={this.member.workPhoneNumber}
                        mask="(999) 999-9999"
                        onChange={((...args) => this.handleChange('workPhoneNumber', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                      <Divider />
                      <MaskedInput
                        floatingLabelText="Mobile Phone"
                        value={this.member.cellPhoneNumber}
                        mask="(999) 999-9999"
                        onChange={((...args) => this.handleChange('cellPhoneNumber', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                      <Divider />
                      <TextField
                        floatingLabelText="Email Address"
                        value={this.member.emailAddress}
                        onChange={((...args) => this.handleChange('emailAddress', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                      <Divider />
                      <SelectField
                        floatingLabelText="Gender"
                        value={this.member.gender}
                        onChange={((...args) => this.handleChangeSelect('gender', ...args))}
                        style={dropDownStyle}
                        underlineStyle={{ display: 'none' }}
                      >
                        <MenuItem value={'M'} primaryText="Male" />
                        <MenuItem value={'F'} primaryText="Female" />
                      </SelectField>
                      <Divider />
                      <DatePicker
                        onChange={((...args) => this.handleChangeDate('birthday', ...args))}
                        floatingLabelText="Birthday"
                        style={style}
                        underlineStyle={{ display: 'none' }}
                        value={moment(this.member.birthday).toDate()}
                      />
                      <Divider />
                      <Toggle
                        label="Non-Christian"
                        onToggle={((...args) => this.handleChangeToggle('nonChristian', ...args))}
                        toggled={this.member.nonChristian}
                        style={toggleStyle}
                        labelPosition="right"
                      />
                      <Divider />
                      <Toggle
                        label="Non-Member"
                        onToggle={((...args) => this.handleChangeToggle('nonMember', ...args))}
                        toggled={this.member.nonMember}
                        style={toggleStyle}
                        labelPosition="right"
                      />
                      <Divider />
                      <Toggle
                        label="College Student"
                        onToggle={((...args) => this.handleChangeToggle('collegeStudent', ...args))}
                        toggled={this.member.collegeStudent}
                        style={toggleStyle}
                        labelPosition="right"
                      />
                    </Tab>
                    <Tab
                      label="Pictures"
                      value={'pictures'}
                    >
                    </Tab>
                  </Tabs>
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
      );
    } else {
      retVal = (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="No Member Selected" goBackTo="/members" />
            </Col>
          </Row>
        </Grid>
      );
    }
    return retVal;
  }
}

export default Member;
