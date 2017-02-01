import React, {Component, PropTypes} from 'react'

import {red500} from 'material-ui/styles/colors'

import RaisedButton from 'material-ui/RaisedButton'
import FlatButton  from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import TextField from 'material-ui/TextField'

class TimeEntryInputForm extends Component {
  static propTypes = {
    text: PropTypes.string,
    duration: PropTypes.string,
    onChangeText: PropTypes.func,    
    onOpenDialog: PropTypes.func,
    onStop: PropTypes.func,
    onDelete: PropTypes.func,
    onStart: PropTypes.func
  }

  static defaultProps = {
    text: ''//having default value so the input is controlled element
  }

  constructor (props) {
    super(props)
    this.state = {
      text: props.text
    }

  }

  handleChangeText = (e) => {
    const text = e.target.value
    this.setState({
      text: text
    })
    this.props.onChangeText(text)
  }

  handleStart = (e) => {
    e.preventDefault()
    this.props.onStart(this.state.text)
  }

  render() {
    return (
      <div>
        <TextField
          hintText="What are you doing ?"
          value={this.state.text}
          onChange={this.handleChangeText}
          name="text"
        />
        <span 
          onTouchTap={this.props.onOpenDialog}
          style={{
            marginLeft: 20,
            minWidth: 56,
            display: 'inline-block'
          }}
        >
          {this.props.duration ? this.props.duration : '0:00:00'}
        </span>
        {
          this.props.duration
          ?
          <RaisedButton
            icon={<FontIcon className="material-icons" style={{color: red500, width: 50, fontSize: 30}}>stop</FontIcon>}
            style={{
              marginLeft: 20,
              minWidth: 50
            }}
            buttonStyle={{
              width: 50
            }}
            onClick={this.props.onStop}
          />
          :
          ''
        }

        {
          this.props.duration
          ?
          <FlatButton 
            icon={<FontIcon className="material-icons" style={{color: 'grey', width: 50, fontSize: 20}}>delete</FontIcon>}
            style={{
              marginLeft: 20,
              minWidth: 50
            }}
            onClick={this.props.onDelete}
          />
          :
          ''
        }

        {
          !this.props.duration
          ?
          <FlatButton 
            icon={<FontIcon className="material-icons" style={{color: 'green', width: 50, fontSize: 30}}>play_arrow</FontIcon>}
            style={{
              marginLeft: 20,
              minWidth: 50
            }}
            onClick={this.handleStart}
          />
          :
          ''
        }        
      </div> 
    )
  }
}

export default TimeEntryInputForm