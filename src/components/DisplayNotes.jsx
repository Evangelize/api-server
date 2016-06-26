import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import { observer } from "mobx-react";
import { connect } from 'mobx-connect';
import { browserHistory } from 'react-router';
import ReactGridLayout from 'react-grid-layout';
import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import CardTitle from 'material-ui/Card/CardTitle';
import * as Colors from 'material-ui/styles/colors';
import Transitions from 'material-ui/styles/transitions';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Masonry from 'react-masonry-component';
import { Col } from 'react-bootstrap';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';


@connect
class DisplayNotes extends Component {

  constructor(props, context) {
    super(props, context);

  }

 
  componentWillMount() {
    const { classes } = this.context.state;
    this.setState({
      now: moment(moment.tz('America/Chicago').format('YYYY-MM-DD')).valueOf(),
      currentNote: {
        id: null,
        title: null,
        text: null
      },
      showDialog: false
    });
  }
  
  handleNoteDelete(note, e) {
    e.stopPropagation();
    const { classes } = this.context.state;
    classes.deleteRecord("notes", note.id);
  }
  
  handleCardTouchTap(note, e) {
    this.setState({
      currentNote: note,
      showDialog: true
    });
  }

  handleDialogClose(e) {
    if (!this.state.currentNote.id) {
      let title = (this.refs.title.getValue().length) ? this.refs.title.getValue() : null;
      this.setState({
        currentNote: {
          id: this.state.currentNote.id,
          text: this.state.currentNote.text,
          title: title
        }
      });
      /*
      dispatch(
        addNote(
          this.state.currentNote
        )
      );
      */
    }
    this.setState({
      showDialog: false
    });
  }

  handleEditorChange(text) {
    if (this.state.currentNote.id) {
      this.delayedNoteUpdate(this.state.currentNote, {text: text});
    } else {
      this.setState({
        currentNote: {
          id: this.state.currentNote.id,
          text: text,
          title: this.state.currentNote.title
        }
      });
    }
  }

  handleTitleChange(e) {
    let title = (this.refs.title.getValue().length) ? this.refs.title.getValue() : null;
    if (this.state.currentNote.id) {
      this.delayedNoteUpdate(this.state.currentNote, {title: title});
    } else {
      this.setState({
        currentNote: {
          id: this.state.currentNote.id,
          text: this.state.currentNote.text,
          title: title
        }
      });
    }
  }

  getNotes() {
    const { classes } = this.context.state;
    let results = classes.getNotes();
    return results;
  }
  
  render() {
    const { divisionConfigs } = this.state,
          customActions = [
            <FlatButton
              key={0}
              label="Done"
              primary={true}
              onTouchTap={::this.handleDialogClose} />
          ];
    return (
      <div>
        <Masonry>
          {this.getNotes().map((note, index) =>
            <Col key={note.id} xs={12} sm={6} md={6} lg={6}>
              <Card>
                <CardTitle title={note.title} style={(note.title) ? null : {display: 'none'}} />
                <CardMedia onClick={((...args)=>this.handleCardTouchTap(note, ...args))}>
                <div style={{padding: "10px 25px"}} dangerouslySetInnerHTML={{__html: note.text}} />
                <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                    <IconButton
                    iconClassName="material-icons"
                    tooltipPosition="top-center"
                    tooltip="Delete"
                    iconStyle={{color: "grey"}}
                    onTouchTap={((...args)=>this.handleNoteDelete(note, ...args))}>
                        delete
                    </IconButton>
                </div>
                </CardMedia>
              </Card>
            </Col>
          )}
      </Masonry>
      <Dialog
          title={
            <TextField
              style={{margin: "25px"}}
              ref="title"
              hintText="Title"
              onChange={::this.handleTitleChange}
              defaultValue={this.state.currentNote.title} />
          }
          actions={customActions}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          open={this.state.showDialog}
          onRequestClose={::this.handleDialogClose}>
          
        </Dialog>
      </div>
    );
  }
}
export default DisplayNotes;
