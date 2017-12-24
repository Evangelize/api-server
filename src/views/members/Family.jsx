import React, { Component } from 'react';
import moment from 'moment-timezone';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import { Tabs, Tab } from 'material-ui/Tabs';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import Snackbar from 'material-ui/Snackbar';
import { Grid, Row, Col } from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor';
import RenderPeople from '../../components/RenderPeople';
import DialogConfirmDelete from '../../components/DialogConfirmDelete';
import NavToolBar from '../../components/NavToolBar';
import { STATES } from '../../constants';

const style = {
  marginLeft: 20,
};

const styles = {
  button: {
    margin: 12,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
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
class family extends Component {
  @observable family;
  @observable isNew = false;
  @observable slideIndex = 'information';
  @observable photo;
  @observable mimeType = 'image/jpeg';
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
  }
  @observable showNotification = false;
  @observable notificationMsg = 'Photo uploaded';
  @observable dialogOpen = false;
  @observable deleteItem;
  @observable dialogDeleteOpen = false;

  componentWillMount() {
    const { people, params } = this.props;
    if (params.id) {
      this.family = people.getFamily(params.id);
    } else {
      this.isNew = true;
      this.family = people.createFamily();
    }
    if (this.family.photoUrl) {
      this.photo = this.family.photoUrl;
    } 
  }

  navigate(path, e) {
    browserHistory.push(path);
  }

  handleSave = async () => {
    const { people } = this.props;
    this.renderPreview();
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage();

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas();

      const blob = canvas.toDataURL(this.mimeType);
      const results = await people.updateFamilyAvatar(
        this.family,
        blob,
        `family-${this.family.id}.jpg`,
        this.mimeType
      );
      this.notificationMsg = 'Photo uploaded';
      this.showNotification = true;
      console.log('saved blob', results);
    }
  }

  renderPreview = () => {
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

  handleNewImage = e => {
    this.photo = e.target.files[0];
    this.mimeType = this.photo.type;
  }

  changeAvatarSettings = (type, e, value) => {
    if (type === 'position.x') {
      this.image.position.x = value;
    } else if (type === 'position.y') {
      this.image.position.y = value;
    } else {
      this.image[type] = value;
    }

    this.renderPreview();
  }

  handlePositionChange = position => {
    // console.log('Position set to', position)
    this.image.position = position;
    this.renderPreview();
  }

  rotate = (type, e) => {
    e.preventDefault()

    if (type === 'left') {
      this.image.rotate = this.image.rotate - 90;
    } else if (type === 'right') {
      this.image.rotate = this.image.rotate + 90;
    }

    this.renderPreview();
  }

  setEditorRef = (editor) => {
    this.editor = editor;
  }

  handleNotificationClose = () => {
    this.showNotification = false;
  }

  handleChange = (field, e) => {
    const { people } = this.props;
    const record = {};
    if (this.family.id) {
      record[field] = e.target.value;
      people.db.updateCollectionFields('families', this.family.id, record);
    } else {
      this.family[field] = e.target.value;
    }
  }

  handleChangeSelect = (field, e, key, payload) => {
    const { people } = this.props;
    const record = {};
    if (this.family.id) {
      record[field] = payload;
      people.db.updateCollectionFields('families', this.family.id, record);
    } else {
      this.family[field] = payload;
    }
  }

  handleChangeDate = (field, ...args) => {
    const { people } = this.props;
    const record = {};
    if (this.family.id) {
      record[field] = moment(args[1]).valueOf();
      people.db.updateCollectionFields('families', this.family.id, record);
    } else {
      this.family[field] = moment(args[1]).valueOf();
    }
  }

  handleChangeToggle = (field, ...args) => {
    const { people } = this.props;
    const record = {};
    console.log(args);
    if (this.family.id) {
      record[field] = (args[1]);
      people.db.updateCollectionFields('families', this.family.id, record);
    } else {
      this.family[field] = (args[1]);
    }
  }

  changeTab = (index) => {
    if (typeof index === 'string') this.slideIndex = index;
  }

  tapItem = (type, item) => {
    if (type === 'edit') {
      this.navigate(`/members/person/${item.id}`);
    } else if (type === 'delete') {
      this.deleteItem = item;
      this.dialogDeleteOpen = true;
    }
  }

  addPeople = () => {
    this.navigate(`/members/family/${this.family.id}/add`);
  }

  handleDeleteClose = (type) => {
    const { people } = this.props;
    this.dialogDeleteOpen = false;
    if (type === 'ok') {
      people.deletePersonFromFamily(this.deleteItem);
    }
    this.deleteItem = null;
  }

  render() {
    const { people } = this.props;
    let retVal;
    if (this.family) {
      retVal = (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Family" goBackTo="/members/families">
                {(this.family.name) ?
                  <ToolbarGroup key={1} lastChild style={{ float: 'right' }}>
                    <RaisedButton
                      label="Add People"
                      secondary
                      onTouchTap={this.addPeople}
                    />
                  </ToolbarGroup> : null
                }
              </NavToolBar>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={(this.family.name) ? `${this.family.name}` : 'Add New Family'}
                  subtitle={(this.family.familyName) ? this.family.familyName : ''}
                  avatar={(this.family.name) ? <Avatar>{this.family.name.charAt(0)}</Avatar> : null}
                />
                <CardMedia>
                  {(this.family.name) ?
                    <Tabs
                      value={this.slideIndex}
                      onChange={this.changeTab}
                    >
                      <Tab
                        label="Information"
                        value={'information'}
                      >
                        <TextField
                          floatingLabelText="Name"
                          value={this.family.name}
                          onChange={((...args) => this.handleChange('name', ...args))}
                          style={style}
                          underlineShow={false}
                        />
                        <Divider />
                        <TextField
                          floatingLabelText="Family Name"
                          value={this.family.familyName}
                          onChange={((...args) => this.handleChange('familyName', ...args))}
                          style={style}
                          underlineShow={false}
                        />
                        <Divider />
                        <TextField
                          floatingLabelText="Address"
                          value={this.family.address1}
                          onChange={((...args) => this.handleChange('address1', ...args))}
                          style={style}
                          underlineShow={false}
                        />
                        <Divider />
                        <TextField
                          floatingLabelText="Address 2"
                          value={this.family.address2}
                          onChange={((...args) => this.handleChange('address2', ...args))}
                          style={style}
                          underlineShow={false}
                        />
                        <Divider />
                        <TextField
                          floatingLabelText="City"
                          value={this.family.city}
                          onChange={((...args) => this.handleChange('city', ...args))}
                          style={style}
                          underlineShow={false}
                        />
                        <Divider />
                        <SelectField
                          floatingLabelText="State"
                          value={this.family.state}
                          onChange={((...args) => this.handleChangeSelect('state', ...args))}
                          style={dropDownStyle}
                          underlineStyle={{ display: 'none' }}
                        >
                          {STATES.map(state => <MenuItem key={state.code} value={state.code} primaryText={state.name} />)}
                        </SelectField>
                        <Divider />
                        <TextField
                          floatingLabelText="Zip Code"
                          value={this.family.zipCode}
                          onChange={((...args) => this.handleChange('zipCode', ...args))}
                          style={style}
                          underlineShow={false}
                        />
                      </Tab>
                      <Tab
                        label="Family Members"
                        value={'members'}
                      >
                        <RenderPeople
                          people={people.getFamilyMembers(this.family.id)}
                          onTap={this.tapItem}
                          rightMenuItems={[
                            'Edit',
                            'Delete',
                          ]}
                        />
                      </Tab>
                      <Tab
                        label="Pictures"
                        value={'pictures'}
                      >
                        {this.photo ?
                          <div>
                            <Row>
                              <Col xs={12} sm={12} md={6} lg={6}>
                                <AvatarEditor
                                  ref={this.setEditorRef}
                                  image={this.photo}
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
                              </Col>
                              <Col xs={12} sm={12} md={6} lg={6}>
                                {this.preview && this.preview.img &&
                                  <Avatar
                                    src={this.preview.img}
                                  />
                                }
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={12} md={12} lg={12}>
                                <RaisedButton
                                  label="Choose an Image"
                                  labelPosition="before"
                                  style={styles.button}
                                  containerElement="label"
                                >
                                  <input
                                    type="file"
                                    style={styles.exampleImageInput}
                                    onChange={this.handleNewImage}
                                  />
                                </RaisedButton>
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
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={12} md={12} lg={12}>
                                <RaisedButton
                                  primary
                                  label="Save"
                                  onClick={((...args) => this.handleSave(...args))}
                                />
                              </Col>
                            </Row>
                          </div> :
                          <RaisedButton
                            label="Choose an Image"
                            labelPosition="before"
                            style={styles.button}
                            containerElement="label"
                          >
                            <input
                              type="file"
                              style={styles.exampleImageInput}
                              onChange={this.handleNewImage}
                            />
                          </RaisedButton>
                        }
                      </Tab>
                    </Tabs> :
                    <div>
                      <TextField
                        floatingLabelText="Name"
                        value={this.family.name}
                        onChange={((...args) => this.handleChange('name', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                      <Divider />
                      <TextField
                        floatingLabelText="Family Name"
                        value={this.family.familyName}
                        onChange={((...args) => this.handleChange('familyName', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                      <Divider />
                      <TextField
                        floatingLabelText="Address"
                        value={this.family.address}
                        onChange={((...args) => this.handleChange('address', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                      <Divider />
                      <TextField
                        floatingLabelText="Address 2"
                        value={this.family.address2}
                        onChange={((...args) => this.handleChange('address2', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                      <Divider />
                      <TextField
                        floatingLabelText="City"
                        value={this.family.city}
                        onChange={((...args) => this.handleChange('city', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                      <Divider />
                      <SelectField
                        floatingLabelText="State"
                        value={this.family.state}
                        onChange={((...args) => this.handleChangeSelect('state', ...args))}
                        style={dropDownStyle}
                        underlineStyle={{ display: 'none' }}
                      >
                        {STATES.map(state => <MenuItem key={state.code} value={state.code} primaryText={state.name} />)}
                      </SelectField>
                      <Divider />
                      <TextField
                        floatingLabelText="Zip Code"
                        value={this.family.zipCode}
                        onChange={((...args) => this.handleChange('zipCode', ...args))}
                        style={style}
                        underlineShow={false}
                      />
                    </div>
                  }
                </CardMedia>
              </Card>
              <Snackbar
                open={this.showNotification}
                message={this.notificationMsg}
                autoHideDuration={4000}
                onRequestClose={this.handleNotificationClose}
              />
              <DialogConfirmDelete
                open={this.dialogDeleteOpen}
                onClose={this.handleDeleteClose}
              />
            </Col>
          </Row>
        </Grid>
      );
    } else {
      retVal = (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="No family Selected" goBackTo="/members/families" />
            </Col>
          </Row>
        </Grid>
      );
    }
    return retVal;
  }
}

export default family;
