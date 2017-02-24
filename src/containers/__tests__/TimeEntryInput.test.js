import React from 'react'
import {shallow, mount} from 'enzyme'

import {toAmPm} from '../../utils/time'

import withStoreAndTheme from '../../__mocks__/withStoreAndTheme'
import TimeEntryInput_withConnect, {TimeEntryInput} from '../TimeEntryInput'

import withTheme from '../../__mocks__/withTheme'

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const uid = '123'
const TimeEntryInput_withStoreAndTheme = withStoreAndTheme(TimeEntryInput_withConnect, {
  auth: {
    user: {
      uid
    }
  }
})
const TimeEntryInput_withTheme = withTheme(TimeEntryInput)

describe('<TimeEntryInput />', () => {
  it ('render with store and theme', () => {
    const wrapper = mount(<TimeEntryInput_withStoreAndTheme />)
    expect(wrapper.children().length).toBeGreaterThan(0)
  })

  it ('render', () => {
    const props = {
      onPull: jest.fn(),
      onChangeText: jest.fn(),
      onChangeStartTime: jest.fn(),
      onStop: jest.fn(),
      onStart: jest.fn(),
      onPull: jest.fn(),
      onRemove: jest.fn(),
      onCreateTag: jest.fn()
    }
    const wrapper = mount(<TimeEntryInput_withStoreAndTheme {...props} />)
    expect(wrapper.children().length).toBeGreaterThan(0)
    // expect(props.onPull).toHaveBeenCalledTimes(1)
  })

  it ('can pull current tracking entry from server during first render', () => {
    const props = {
      onPull: jest.fn()
    }
    const wrapper = mount(<TimeEntryInput_withStoreAndTheme {...props} />)
    // expect(props.onPull).toHaveBeenCalledTimes(1)
  })

  it ('can change start time', () => {
    //20:20 PM UTC
    const now =               new Date(Date.UTC(2017, 1, 12, 20, 20, 0))
    //earlier than now 20 minutes
    //20:00 PM UTC
    const originalStartTime = new Date(Date.UTC(2017, 1, 12, 20, 0, 0))
    //earlier than now 10 minutes
    //20:10 PM UTC
    const newStartTime =      new Date(Date.UTC(2017, 1, 12, 20, 10, 0))
    const props = {
      now: now.getTime(),
      onPull: jest.fn(),
      onChangeStartTime: jest.fn(),
      startTime: originalStartTime.getTime(),
      uid
    }
    const wrapper = shallow(<TimeEntryInput {...props} />)

    wrapper.instance().handleUpdateStartTimeAmPm({
      target: {
        value: toAmPm(newStartTime)
      }
    })
    expect(props.onChangeStartTime).toHaveBeenCalledTimes(1)
    expect(props.onChangeStartTime.mock.calls[0][0]).toBe(uid)
    //remove milisecond during compare
    expect(props.onChangeStartTime.mock.calls[0][1].toJSON().slice(0, -5)).toBe(newStartTime.toJSON().slice(0, -5))
  
  })

  it ('can only change time to valid format data', () => {
    
    const now = new Date()
    //earlier than now 20 minutes
    const originalStartTime = new Date((now).setMinutes(now.getMinutes() - 20))
    const originalStartTimeAmPm = toAmPm(originalStartTime)
    const props = {
      onPull: jest.fn(),
      onChangeStartTime: jest.fn(),
      startTime: originalStartTime.getTime()
    }
    const wrapper = shallow(<TimeEntryInput {...props} />)

    wrapper.instance().handleUpdateStartTimeAmPm({
      target: {
        value: 'invalid time'
      }
    })
    
    expect(props.onChangeStartTime).toHaveBeenCalledTimes(0)
    expect(wrapper.state().startTimeAmPm).toBe(originalStartTimeAmPm)
  })

  it ('should be able to handle delete current tracking item', () => {
    const now = new Date()
    //earlier than now 20 minutes
    const startTime = new Date((now).setMinutes(now.getMinutes() - 20))
    const props = {
      onPull: jest.fn(),
      onRemove: jest.fn(),
      startTime: startTime.getTime()
    }
    const wrapper = shallow(<TimeEntryInput {...props} />)

    wrapper.instance().handleRemove()
    
    expect(props.onRemove).toHaveBeenCalledTimes(1)
  })

  it ('can stop and save current tracking data', () => {
    const now = new Date()
    //earlier than now 20 minutes
    const startTime = new Date((now).setMinutes(now.getMinutes() - 20))
    const props = {
      onPull: jest.fn(),
      onStop: jest.fn(),
      startTime: startTime.getTime()
    }
    const wrapper = shallow(<TimeEntryInput {...props} />)

    wrapper.instance().handleStop()
    
    expect(props.onStop).toHaveBeenCalledTimes(1)    
  })
})
