import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import moment from 'moment-timezone';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import { ToolbarGroup } from 'material-ui/Toolbar';
import { Grid, Row, Col } from 'react-bootstrap';
import NavToolBar from '../../components/NavToolBar';

@inject('worship', 'jobs')
@observer
class WorshipJobsSelect extends Component {
  @observable service;

  componentWillMount() {
    const { worship, params } = this.props;
    const { id } = params;
    this.service = worship.getService(id);
  }

  handleSelect = (job, event, isInputChecked) => {
    const { jobs, params } = this.props;
    jobs.updateWorshipServiceJob(this.service.id, job.id, isInputChecked);
  }

  render() {
    const { jobs, params } = this.props;
    const serviceJobs = jobs.getWorshipServiceJobs(this.service.id).map((rec) => rec.id);
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar
                navLabel={`${this.service.title} - Jobs`}
                goBackTo={'/worship/services/list'}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={'Select Jobs'}
                  subtitle={`${this.service.title}`}
                  avatar={<Avatar>J</Avatar>}
                />
                <CardMedia>
                  <List>
                    {jobs.getJobs().map((job) =>
                      <div key={job.id}>
                        <Divider />
                        <ListItem
                          leftCheckbox={
                            <Checkbox
                              checked={serviceJobs.indexOf(job.id) > -1}
                              onCheck={((...args) => this.handleSelect(job, ...args))}
                            />
                          }
                          primaryText={job.title}
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

export default WorshipJobsSelect;
