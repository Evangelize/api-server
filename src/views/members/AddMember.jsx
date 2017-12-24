import React, { Component } from 'react';
import moment from 'moment-timezone';
import momentFquarter from 'moment-fquarter';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import Masonry from 'react-masonry-component';
import Card from 'material-ui/Card/Card';
import FlatButton from 'material-ui/FlatButton';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import CardActions from 'material-ui/Card/CardActions';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';
import MaskedInput from '../../components/MaskedInput';

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
  {
    height: '51px',
    marginTop: '21px',
  },
);

@inject('people')
@observer
class AddMember extends Component {
  @observable member = {
    id: null,
    entityId: null,
    familyId: null,
    firstName: '',
    lastName: '',
    workPhoneNumber: '',
    cellPhoneNumber: '',
    emailAddress: '',
    gender: 'M',
    birthday: moment(),
    nonChristian: false,
    nonMember: false,
    collegeStudent: false,
    photoUrl: null,
  };


  componentWillMount() {
    const { people, params } = this.props;
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  handleSave = () => {
    const { people } = this.props;
    const person = people.addPerson(this.member);
    this.navigate(`/members/person/${person.id}`);
  }

  handleChange = (field, e) => {
    this.member[field] = e.target.value;
  }

  handleChangeSelect = (field, e, key, payload) => {
    this.member[field] = payload;
  }

  handleChangeDate = (field, ...args) => {
    this.member[field] = moment(args[1]).valueOf();
  }

  handleChangeToggle = (field, ...args) => {
    this.member[field] = (args[1]);
  }

  render() {
    const retVal = (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <NavToolBar navLabel="Add Member" goBackTo="/members/search" />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardText>
                <TextField
                  floatingLabelText="First Name"
                  value={this.member.firstName}
                  onChange={((...args) => this.handleChange('firstName', ...args))}
                  fullWidth
                  underlineShow={false}
                />
                <Divider />
                <TextField
                  floatingLabelText="Last Name"
                  value={this.member.lastName}
                  onChange={((...args) => this.handleChange('lastName', ...args))}
                  underlineShow={false}
                />
                <Divider />
                <MaskedInput
                  floatingLabelText="Work Phone"
                  value={this.member.workPhoneNumber}
                  mask="(999) 999-9999"
                  onChange={((...args) => this.handleChange('workPhoneNumber', ...args))}
                  underlineShow={false}
                />
                <Divider />
                <MaskedInput
                  floatingLabelText="Mobile Phone"
                  value={this.member.cellPhoneNumber}
                  mask="(999) 999-9999"
                  onChange={((...args) => this.handleChange('cellPhoneNumber', ...args))}
                  underlineShow={false}
                />
                <Divider />
                <TextField
                  floatingLabelText="Email Address"
                  value={this.member.emailAddress}
                  onChange={((...args) => this.handleChange('emailAddress', ...args))}
                  underlineShow={false}
                />
                <Divider />
                <SelectField
                  floatingLabelText="Gender"
                  value={this.member.gender}
                  onChange={((...args) => this.handleChangeSelect('gender', ...args))}
                  underlineStyle={{ display: 'none' }}
                >
                  <MenuItem value={'M'} primaryText="Male" />
                  <MenuItem value={'F'} primaryText="Female" />
                </SelectField>
                <Divider />
                <DatePicker
                  onChange={((...args) => this.handleChangeDate('birthday', ...args))}
                  floatingLabelText="Birthday"
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
                <Divider />
                <SelectField
                  floatingLabelText="Family Position"
                  value={this.member.familyPosition}
                  onChange={((...args) => this.handleChangeSelect('familyPosition', ...args))}
                  style={dropDownStyle}
                  underlineStyle={{ display: 'none' }}
                >
                  <MenuItem value={'H'} primaryText="Head of Household" />
                  <MenuItem value={'S'} primaryText="Spouse" />
                  <MenuItem value={'C'} primaryText="Child" />
                </SelectField>
              </CardText>
              <CardActions>
                <RaisedButton
                  label="Cancel"
                  onTouchTap={((...args) => this.navigate('/members/search', ...args))}
                  style={{ marginRight: 12 }}
                />
                <RaisedButton
                  label="Save"
                  primary
                  onTouchTap={((...args) => this.handleSave(...args))}
                />
              </CardActions>
            </Card>
          </Col>
        </Row>
      </Grid>
    );
    return retVal;
  }
}

export default AddMember;
