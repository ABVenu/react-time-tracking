import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {get} from 'lodash'

import {toAmPm, fromAmPM, fromAmPmToDate} from '../utils/time'
import {changeText, changeStartTime, stop, start, pull, remove} from '../actions/timeEntryInput'

import TextField from 'material-ui/TextField'
import Dialog from 'material-ui/Dialog'

import TimeEntryInputForm from '../components/TimeEntryInputForm'

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
    onRemove: PropTypes.func,
    isFetching: PropTypes.bool
  }

  static defaultProps = {
    text: '',
    isFetching: false
  }

  constructor (props) {
    super(props)

    const startTime = props.startTime ? new Date(props.startTime) : null
    const startTimeAmPm = props.startTime ? toAmPm(new Date(props.startTime)) : null

    this.state = {
      startTime,
      startTimeAmPm,
      dialogOpen: false
    }
  }

  componentWillMount() {
    this.props.onPull(this.props.uid)
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.startTime) {
      const startTime =  new Date(nextProps.startTime)
      const startTimeAmPm = toAmPm(startTime)

      this.setState({
        startTime,
        startTimeAmPm
      })
    }
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
      this.props.onChangeStartTime(this.props.uid, newStartTimeInDate.toJSON())
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

  handleRemove = () => {
    this.props.onRemove(this.props.uid)
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
          onRemove={this.handleRemove}
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
    onChangeStartTime: (uid, date) => {
      dispatch(changeStartTime(uid, date))
    },
    onStop: (uid, text, date) => {
      dispatch(stop(uid, text, date))
    },
    onStart: (uid, text, date) => {
      dispatch(start(uid, text, date))
    },
    onPull: (uid) => {
      dispatch(pull(uid))
    },
    onRemove: (uid) => {
      dispatch(remove(uid))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    startTime: get(state,"timeEntryInput.startTime", null),
    text: get(state, "timeEntryInput.text", null),
    uid: get(state,"auth.user.uid", null),
    isFetching: get(state, "timeEntryInput.isFetching", null)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeEntryInput)