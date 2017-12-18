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
import Slider from 'material-ui/Slider';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Grid, Row, Col } from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor'
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
  style,
  {
    width: 'calc(98% - 21px)',
    height: '51px',
    marginTop: '21px',
  },
);

@inject('people')
@observer
class Member extends Component {
  @observable member;
  @observable family;
  @observable slideIndex = 'information';
  @observable editor;
  @observable preview;
  @observable image = {
    height: 250,
    width: 250,  
    border: 50,
    color: [255, 255, 255, 0.6], // RGBA
    scale: 1.0,
    position: {
      x: 0.5,
      y: 0.5,
    },
    rotate: 0,
  };


  componentWillMount() {
    const { people, params } = this.props;
    this.member = people.getPerson(params.id);
    this.family = ('familyId' in this.member) ? people.getFamily(this.member.familyId) : null;
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  handleSave = (data) => {
    const img = this.editor.getImageScaledToCanvas().toDataURL();
    const rect = this.editor.getCroppingRect();

    this.preview = {
      img,
      rect,
      scale: this.image.scale,
      width: this.image.width,
      height: this.image.height,
      borderRadius: this.image.border,
    };
  }


  handleChange = (field, e) => {
    const { people } = this.props;
    let record = {};
    record[field] = e.target.value;
    people.db.updateCollectionFields('people', this.member.id, record);
  }

  handleChangeSelect = (field, e, key, payload) => {
    const { people } = this.props;
    let record = {};
    record[field] = payload;
    people.db.updateCollectionFields('people', this.member.id, record);
  }

  handleChangeDate = (field, ...args) => {
    const { people } = this.props;
    let record = {};
    record[field] = moment(args[1]).valueOf();
    people.db.updateCollectionFields('people', this.member.id, record);
  }

  handleChangeToggle = (field, ...args) => {
    const { people } = this.props;
    let record = {};
    console.log(args);
    record[field] = (args[1]);
    people.db.updateCollectionFields('people', this.member.id, record);
  }

  updateTitle(e) {
    const { people } = this.props;
    const { params } = this.props;
    people.db.updateCollectionFields('people', params.classId, { title: e.target.value });
  }

  changeTab = (index) => {
    if (typeof index === 'string') this.slideIndex = index;
  }

  changeAvatarSettings = (type, e, value) => {
    if (type === 'position.x') {
      this.image.position.x = value;
    } else if (type === 'position.y') {
      this.image.position.y = value;
    } else {
      this.image[type] = value;
    }
  }

  handlePositionChange = position => {
    console.log('Position set to', position)
    this.image.position = position;
  }

  rotate = (type, e) => {
    e.preventDefault()

    if (type === 'left') {
      this.image.rotate = this.image.rotate - 90;
    } else if (type === 'right') {
      this.image.rotate = this.image.rotate + 90;
    }
  }

  setEditorRef = (editor) => {
    this.editor = editor;
  }

  render() {
    const { people } = this.props;
    let retVal;
    if (this.member) {
      retVal = (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Member" goBackTo="/members/search" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={`${this.member.lastName}, ${this.member.firstName}`}
                  subtitle={(this.family) ? this.family.familyName : null}
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
                      {(this.member.photoUrl || (this.family && this.family.photoUrl)) &&
                        <div>
                          <AvatarEditor
                            ref={this.setEditorRef}
                            image={(this.member.photoUrl) ? this.member.photoUrl : this.family.photoUrl}
                            width={this.image.width}
                            height={this.image.height}
                            color={this.image.color.toJS()} //RGBA
                            scale={this.image.scale}
                            rotate={this.image.rotate}
                            position={this.image.position}
                            onSave={this.handleSave}
                            onPositionChange={this.handlePositionChange}
                            rotate={parseFloat(this.image.rotate)}
                            borderRadius={this.image.border}
                          />
                          {this.preview && this.preview.img &&
                            <Avatar
                              src={this.preview.img}
                            />
                          }
                          <div
                            style={{
                              margin: 10,
                            }}
                          >
                            <div>Zoom:</div>
                            <Slider
                              step={0.01}
                              min={1}
                              max={4}
                              value={this.image.scale}
                              onChange={((...args) => this.changeAvatarSettings('scale', ...args))}
                            />
                            <div>Border radius:</div>
                            <Slider
                              step={1}
                              min={0}
                              max={100}
                              value={this.image.border}
                              onChange={((...args) => this.changeAvatarSettings('border', ...args))}
                            />
                            <div>Avatar Width:</div>
                            <Slider
                              step={10}
                              min={50}
                              max={600}
                              value={this.image.width}
                              onChange={((...args) => this.changeAvatarSettings('width', ...args))}
                            />
                            <div>Avatar Height:</div>
                            <Slider
                              step={10}
                              min={50}
                              max={600}
                              value={this.image.height}
                              onChange={((...args) => this.changeAvatarSettings('height', ...args))}
                            />
                            <div>X Position:</div>
                            <Slider
                              step={0.01}
                              min={0}
                              max={1}
                              value={this.image.position.x}
                              onChange={((...args) => this.changeAvatarSettings('position.x', ...args))}
                            />
                            <div>Y Position:</div>
                            <Slider
                              step={0.01}
                              min={0}
                              max={1}
                              value={this.image.position.y}
                              onChange={((...args) => this.changeAvatarSettings('position.y', ...args))}
                            />
                            <div>Rotate:</div>
                            <RaisedButton
                              label="Left"
                              onClick={((...args) => this.rotate('left', ...args))}
                            />
                            <RaisedButton
                              label="Right"
                              onClick={((...args) => this.rotate('right', ...args))}
                            />
                            <br />
                            <RaisedButton
                              primary
                              label="Preview"
                              onClick={((...args) => this.handleSave(...args))}
                            />
                          </div>
                        </div>
                      }
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
