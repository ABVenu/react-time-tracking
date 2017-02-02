import React, {Component, PropTypes} from 'react'
import {toAmPm, fromAmPM, fromAmPmToDate} from '../utils/time'

import {changeText, changeStartTime, stop, start, pull} from '../actions/timeEntryInput'
import {connect} from 'react-redux'

import TextField from 'material-ui/TextField'
import Dialog from 'material-ui/Dialog'

import TimeEntryInputForm from './TimeEntryInputForm'

export class TimeEntryInput extends Component {
  static propTypes = {
    startTime: PropTypes.string,
    text: PropTypes.string,
    uid: PropTypes.string,
    onChangeText: PropTypes.func,
    onChangeStartTime: PropTypes.func,
    onStop: PropTypes.func,
    onStart: PropTypes.func,
    onPull: PropTypes.func,
    isFetching: PropTypes.bool
  }

  static defaultProps = {
    isFetching: false
  }

  constructor (props) {
    super(props)

    this.state = {
      dialogOpen: false
    }
  }

  componentWillMount() {
    this.props.onPull(this.props.uid)
  }

  handleOpenDialog = () => {
    this.setState({dialogOpen:true})
  }

  handleCloseDialog = () => {
    this.setState({dialogOpen:false})
  }

  handleChangeText = (text) => {
    this.props.onChangeText(this.props.uid, text)
  }

  //validate input and save
  handleUpdateStartTimeAmPm = (e) => {
    const value = e.target.value
    
    const startTimeAmPm = fromAmPM(e.target.value)
    if (startTimeAmPm) {
      const now = new Date()
      const newStartTimeInDate = fromAmPmToDate(value, now)
      const newStartTimeAmPm = toAmPm(newStartTimeInDate)
      this.setState({
        startTime: newStartTimeInDate,
        startTimeAmPm: newStartTimeAmPm
      })
      this.props.onChangeStartTime(newStartTimeInDate)
    } 
    //invalid input, revert to current value
    else {
      this.setState({
        startTimeAmPm: toAmPm(this.state.startTime)
      })
    }
  }

  //just save user input during typing
  handleChangeStartTimeAmPm = (e) => {
    this.setState({
      startTimeAmPm: e.target.value
    })
  }

  handleStart = (text) => {
    const now = new Date()
    this.props.onStart(this.props.uid, text, now.toJSON())
  }

  handleStop = () => {
    this.props.onStop(this.props.uid, this.props.text, this.props.startTime)
  }

  render() {
    return (
      <div>
        <TimeEntryInputForm
          text={this.props.text}
          startTime={this.props.startTime}
          isFetching={this.props.isFetching}
          onChangeText={this.handleChangeText}            
          onOpenDialog={this.handleOpenDialog}
          onStop={this.handleStop}
          onStart={this.handleStart}
        />
        <Dialog
          open={this.state.dialogOpen}
          onRequestClose={this.handleCloseDialog}
          contentStyle={{width: 250}}
        >
          Start <TextField
            value={this.state.startTimeAmPm}
            style={{marginLeft: 30, width: 80}}
            onChange={this.handleChangeStartTimeAmPm}
            onBlur={this.handleUpdateStartTimeAmPm}
            name="startTimeAmPm"
          />
          <br />
          End <span
            style={{marginLeft: 35, width: 80}}
          >{toAmPm(new Date())}</span>
        </Dialog>
      </div> 
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeText: (uid, text) => {
      dispatch(changeText(uid, text))
    },
    onChangeStartTime: (date) => {
      dispatch(changeStartTime(date))
    },
    onStop: (uid, text, date) => {
      dispatch(stop(uid, text, date))
    },
    onStart: (uid, text, date) => {
      dispatch(start(uid, text, date))
    },
    onPull: (uid) => {
      dispatch(pull(uid))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    startTime: state.timeEntryInput.startTime,
    text: state.timeEntryInput.text,
    uid: state.auth.user.uid,
    isFetching: state.timeEntryInput.isFetching
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeEntryInput)