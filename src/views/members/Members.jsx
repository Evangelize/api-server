import React, { Component } from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import NavToolBar from '../../components/NavToolBar';
import RenderPeople from '../../components/RenderPeople';
import DialogConfirmDelete from '../../components/DialogConfirmDelete';
import { Grid, Row, Col } from 'react-bootstrap';

@inject('classes')
@observer
class Members extends Component {
  @observable people = [];
  @observable searchType = 'lastName';
  @observable filter = '';
  @observable open = false;
  @observable anchorEl;
  @observable deleteId = null;
  @observable dialogOpen = false;
  @observable dialogDeleteOpen = false;
  componentWillMount() {
    this.setState({
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      height: '300px',
      filter: '',
      people: [],
      displayRowCheckbox: false,
      adjustForCheckbox: false,
      displaySelectAll: false,
    });
  }

  handleInputChange = (e) => {
    const { classes } = this.props;
    this.filter = e.target.value;
    if (this.filter && this.filter.length > 1) {
      this.people = classes.findPeople(this.filter, this.searchType);
    }
  }

  handleSelectValueChange = (e, index, value) => {
    this.searchType = value;
  }

  handleNavMenu = (e, value, index) => {
    if (index === 0) {
      this.navigate('/members/add/person');
    } else if (index === 1) {
      this.navigate('/members/add/family');
    } else if (index === 2) {
      this.navigate('/members/import');
    }
  }

  navigate = (path, e) => {
    browserHistory.push(path);
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.open = true;
    this.anchorEl = event.currentTarget;
  }

  handleRequestClose = () => {
    this.open = false;
  }

  handleOpenDialog = () => {
    const ts = moment();
    this.dialogDeleteOpen = true;
  }


  handleDeleteClose = (type) => {
    const { classes } = this.props;
    this.dialogDeleteOpen = false;
    if (type === 'ok') {
      classes.deleteRecord('people', this.deleteId);
      this.people = classes.findPeople(this.filter, this.searchType);
    }
    this.deleteId = null;
  }

  tapItem = (type, item) => {
    if (type === 'edit') {
      this.navigate(`/members/person/${item.id}`);
    } else if (type === 'delete') {
      this.deleteId = item.id;
      this.dialogDeleteOpen = true;
    }
  }

  handleMenuTap = (e) => {
    e.preventDefault();
  }

  handleTap = (person, e, obj) => {
    e.preventDefault();
    if (obj.props.children === 'Delete') {
      this.deleteId = person.id;
      this.dialogDeleteOpen = true;
    } else if (obj.props.children === 'Edit') {
      this.navigate(`/members/person/${person.id}`);
    }
  }

  render() {
    const dropDownStyle = {
      marginTop: '16px',
    };
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <NavToolBar navLabel="Members" goBackTo="/dashboard">
                <ToolbarGroup key={2} lastChild style={{ float: 'right' }}>
                  <RaisedButton
                    label="Manage Members"
                    secondary
                    onTouchTap={this.handleTouchTap}
                  />
                  <Popover
                    open={this.open}
                    anchorEl={this.anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    onRequestClose={this.handleRequestClose}
                  >
                    <Menu
                      onItemTouchTap={((...args) => this.handleNavMenu(...args))}
                    >
                      <MenuItem primaryText="Add Person" />
                      <MenuItem primaryText="Add Family" />
                      <MenuItem primaryText="Import CSV" />
                    </Menu>
                  </Popover>
                </ToolbarGroup>
              </NavToolBar>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader
                  title={'Members'}
                  subtitle={'Search for members'}
                  avatar={<Avatar>{'M'}</Avatar>}
                />
                <CardMedia>
                  <Row>
                    <Col xs={12} sm={12} md={3} lg={2}>
                      <DropDownMenu
                        value={this.searchType}
                        onChange={((...args) => this.handleSelectValueChange(...args))}
                        style={dropDownStyle}
                      >
                        <MenuItem value={'lastName'} primaryText="Last Name" />
                        <MenuItem value={'firstName'} primaryText="First Name" />
                        <MenuItem value={'emailAddress'} primaryText="Email" />
                      </DropDownMenu>
                    </Col>
                    <Col xs={12} sm={12} md={9} lg={10}>
                      <TextField
                        className={'searchBox'}
                        ref="searchField"
                        floatingLabelText="Search"
                        value={this.filter}
                        onChange={((...args) => this.handleInputChange(...args))}
                      />
                    </Col>
                  </Row>
                </CardMedia>
                <CardMedia>
                  <RenderPeople
                    people={this.people}
                    onTap={this.tapItem}
                    rightMenuItems={[
                      'Edit',
                      'Delete',
                    ]}
                  />
                </CardMedia>
              </Card>
            </Col>
          </Row>
        </Grid>
        <DialogConfirmDelete
          open={this.dialogDeleteOpen}
          onClose={this.handleDeleteClose}
        />
      </div>
    );
  }
}

export default Members;
