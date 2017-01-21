import React from 'react'
import {mount} from 'enzyme'

import {setupWindowMatchMedia, setupLocalStorage} from '../test/utils'

import Root, {basename} from './Root'
import history from '../history'

import configureStore from '../configureStore'

describe('<Root />', () => {
  setupLocalStorage()
  
  it ('render', () => {
    setupWindowMatchMedia(true)


    const wrapper = mount(<Root store={configureStore()} history={history} />)

    expect(wrapper.children().length).toBeGreaterThan(0)
  })
  
})
