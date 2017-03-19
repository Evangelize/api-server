import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';
import Dropzone from 'react-dropzone';
import { readAsText } from 'promise-file-reader';
import NavToolBar from '../../components/NavToolBar';
import { Grid, Row, Col } from 'react-bootstrap';
import neatCsv from '../../lib/neat-csv';
import CircularProgress from 'material-ui/CircularProgress';
const styles = {
  zone: {
    border: '2px dashed #0087F7',
    borderRadius: '5px',
    background: 'white',
    minHeight: '150px',
    padding: '30px',
    cursor: 'pointer',
  },
  heading: {
    textAlign: 'center',
    margin: '2em 0',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  cell: {
    width: '50%',
    float: 'left',
  },
  divider: {
    width: '100%',
    float: 'left',
  },
  cardBody: {
    overflowX: 'hidden',
    overflowY: 'scroll',
    maxHeight: '300px',
    padding: '1.5em',
  },
};

const Field = observer((props) => (
  <div key={props.field.id} style={{ width: '100%' }}>
    <div style={styles.cell}>
      <div style={{ marginTop: '10px' }}>{props.field.title}</div>
    </div>
    <div style={styles.cell}>
      <SelectField
        underlineStyle={{ display: 'none' }}
        autoWidth
        value={props.field.associated}
        onChange={((...args) => props.change(props.field, ...args))}
      >
        {Object.keys(props.record).map((key, index) => <MenuItem key={index} value={key} primaryText={key} />)}
      </SelectField>
    </div>
    <div style={styles.divider}>
      <Divider />
    </div>
  </div>
));

@inject('classes', 'utils', 'messages')
@observer
class ImportMembers extends Component {
  @observable success = false;
  @observable statusMessage = '';
  @observable reset = false;
  @observable familyFields = [
    {
      id: 'name',
      title: 'Family Last Name',
      description: '',
      associated: null,
    },
    {
      id: 'address1',
      title: 'Address 1',
      description: '',
      associated: null,
    },
    {
      id: 'address2',
      title: 'Address 2',
      description: '',
      associated: null,
    },
    {
      id: 'city',
      title: 'City',
      description: '',
      associated: null,
    },
    {
      id: 'state',
      title: 'State',
      description: '',
      associated: null,
    },
    {
      id: 'zipCode',
      title: 'Zip Code',
      description: '',
      associated: null,
    },
    {
      id: 'photoUrl',
      title: 'Photo URL',
      description: '',
      associated: null,
    },
  ];
  @observable peopleFields = [
    {
      id: 'firstName',
      title: 'First Name',
      description: '',
      associated: null,
    },
    {
      id: 'lastName',
      title: 'Last Name',
      description: '',
      associated: null,
    },
    {
      id: 'familyPosition',
      title: 'Family Position',
      description: 'Head of Household, Spouse, Child',
      associated: null,
    },
    {
      id: 'gender',
      title: 'Gender',
      description: '',
      associated: null,
    },
    {
      id: 'homePhoneNumber',
      title: 'Home Phone Number',
      associated: null,
    },
    {
      id: 'workPhoneNumber',
      title: 'Work Phone Number',
      associated: null,
    },
    {
      id: 'cellPhoneNumber',
      title: 'Mobile Phone Number',
      associated: null,
    },
    {
      id: 'emailAddress',
      title: 'Email Address',
      associated: null,
    },
    {
      id: 'birthday',
      title: 'Birthday',
      associated: null,
    },
    {
      id: 'nonChristian',
      title: 'Non-Christian',
      associated: null,
    },
    {
      id: 'nonMember',
      title: 'Non-Member',
      associated: null,
    },
    {
      id: 'membershipStatus',
      title: 'Membership Status',
      associated: null,
    },
    {
      id: 'collegeStudent',
      title: 'College Student',
      associated: null,
    },
    {
      id: 'photoUrl',
      title: 'Photo URL',
      associated: null,
    },
  ];
  @observable csv;
  @observable finished = false;
  @observable stepIndex = 0;
  componentWillMount() {
    const { messages } = this.props;
    messages.subscribe(
      'broadcast',
      this.onBroadcast
    );
  }

  onBroadcast = (update) => {
    const data = update.payload.data;
    if (data.type === 'info:import-complete') {
      this.success = true;
    } else if (data.type === 'info:import-update') {
      this.statusMessage = `${data.record.lastName}, ${data.record.firstName}`;
    }
  }

  navigate = (path, e) => {
    browserHistory.push(path);
  }

  handleNext = () => {
    const { utils } = this.props;
    const self = this;
    this.stepIndex = this.stepIndex + 1;
    this.finished = this.stepIndex >= 3;
    if (this.stepIndex > 3) {
      utils.importUsers(
        this.csv,
        this.familyFields,
        this.peopleFields,
        this.reset
      ).then(
        (data) => {
          self.success = data.success;
        }
      );
    }
  }

  handlePrev = () => {
    if (this.stepIndex > 0) {
      this.stepIndex = this.stepIndex - 1;
    }
  }

  handleFieldSelect = (field, e, key, payload) => {
    const { classes } = this.props;
    field.associated = payload;
  }

  handleToggle = () => {
    this.reset = !this.reset;
  }

  onDrop = (files) => {
    let self = this;
    console.log('Received files: ', files);
    readAsText(files[0])
    .then(csv => {
      neatCsv(csv).then(data => {
        self.csv = data;
        self.handleNext();
      });
    })
    .catch(err => console.error(err));
  }

  render() {
    const dropDownStyle = {
      marginTop: '16px',
    };
    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <NavToolBar navLabel="Import Members" goBackTo="/members/search" />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card>
              <CardMedia>
                <Grid fluid>
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Stepper activeStep={this.stepIndex}>
                        <Step>
                          <StepLabel>Upload</StepLabel>
                        </Step>
                        <Step>
                          <StepLabel>Family</StepLabel>
                        </Step>
                        <Step>
                          <StepLabel>Person</StepLabel>
                        </Step>
                        <Step>
                          <StepLabel>Finish</StepLabel>
                        </Step>
                      </Stepper>
                    </Col>
                  </Row>
                  <Row>
                    {this.stepIndex <= 3 &&
                      <Col xs={12} sm={12} md={12} lg={12}>
                        {this.stepIndex === 0 &&
                          <Dropzone
                            onDrop={this.onDrop}
                            style={styles.zone}
                          >
                            <div style={styles.heading}>Drop the CSV here, or click to select a file to upload.</div>
                          </Dropzone>
                        }

                        {this.stepIndex === 1 &&
                          <Col xs={12} sm={12} md={12} lg={12}>
                            {this.familyFields.map((field) => (
                              <Field key={field.id} field={field} record={this.csv[0]} change={this.handleFieldSelect} />
                            ))}
                          </Col>
                        }

                        {this.stepIndex === 2 &&
                          <Col xs={12} sm={12} md={12} lg={12}>
                            {this.peopleFields.map((field) => (
                              <Field key={field.id} field={field} record={this.csv[0]} change={this.handleFieldSelect} />
                            ))}
                          </Col>
                        }
                      </Col>
                      }
                      {this.stepIndex === 3 &&
                        <Col xs={12} sm={12} md={12} lg={12}>
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Toggle
                              label="Delete existing families and people"
                              onToggle={((...args) => this.handleToggle(...args))}
                              toggled={this.reset}
                              labelPosition="right"
                            />
                          </Col>
                          <Col xs={12} sm={12} md={6} lg={6}>
                            <Card>
                              <CardHeader
                                title="Family Field Mapping"
                                avatar={<Avatar>P</Avatar>}
                              />
                              <CardMedia style={styles.cardBody}>
                                {this.familyFields.map((field) => (
                                  <Field key={field.id} field={field} record={this.csv[0]} change={this.handleFieldSelect} />
                                ))}
                              </CardMedia>
                            </Card>
                          </Col>
                          <Col xs={12} sm={12} md={6} lg={6}>
                            <Card>
                              <CardHeader
                                title="People Field Mapping"
                                avatar={<Avatar>P</Avatar>}
                              />
                              <CardMedia style={styles.cardBody}>
                                {this.peopleFields.map((field) => (
                                  <Field key={field.id} field={field} record={this.csv[0]} change={this.handleFieldSelect} />
                                ))}
                              </CardMedia>
                            </Card>
                          </Col>
                        </Col>
                      }
                      {this.stepIndex === 4 &&
                        <Col xs={12} sm={12} md={12} lg={12}>
                          <Col xs={12} sm={12} md={4} lg={4}>
                            <CircularProgress />
                          </Col>
                          <Col xs={12} sm={12} md={4} lg={4}>
                            {!this.success &&
                              <h4>Importing... {this.statusMessage}</h4>
                            }
                            {this.success &&
                              <h4>Import complete</h4>
                            }
                          </Col>
                        </Col>
                      }
                  </Row>
                </Grid>
              </CardMedia>
              <CardActions>
                <FlatButton
                  label="Back"
                  disabled={this.stepIndex === 0}
                  onTouchTap={this.handlePrev}
                  style={{ marginRight: 12 }}
                />
                <RaisedButton
                  label={this.stepIndex === 3 ? 'Finish' : 'Next'}
                  disabled={this.stepIndex === 4}
                  primary
                  onTouchTap={this.handleNext}
                />
              </CardActions>
            </Card>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default ImportMembers;
