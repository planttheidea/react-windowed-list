// test
import test from 'ava';
import {
  mount,
  shallow
} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

// src
import WindowedList from 'src/index';
import * as utils from 'src/utils';

test('if WindowedList renders correctly with default props', (t) => {
  const wrapper = shallow(
    <div style={{height: 500}}>
      <WindowedList length={1000}/>
    </div>
  );

  t.snapshot(toJson(wrapper));
});

test('if WindowedList renders correctly when type is not simple', (t) => {
  const wrapper = mount(
    <div style={{height: 500}}>
      <WindowedList
        length={1000}
        type="uniform"
      />
    </div>
  );

  t.snapshot(toJson(wrapper));

  const container = wrapper.children().children();

  t.deepEqual(container.prop('style'), utils.getContainerStyle({}, {}, () => {
    return 0;
  }));

  const listContainer = container.children();

  t.deepEqual(listContainer.prop('style'), utils.getListContainerStyle({}, {}, () => {
    return 0;
  }));
});
