// test
import test from 'ava';
import {mount, shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';

// src
import * as component from 'src/WindowedListRenderer';
import * as constants from 'src/constants';

const WindowedListRenderer = component.WindowedListRenderer;

test('if WindowedListRenderer renders correctly with default props', (t) => {
  const wrapper = shallow(
    <div style={{height: 500}}>
      <WindowedListRenderer
        length={1000}
        type={constants.VALID_TYPES.SIMPLE}
      />
    </div>
  );

  t.snapshot(toJson(wrapper));
});

test('if WindowedListRenderer renders correctly when type is not simple', (t) => {
  const wrapper = mount(
    <div style={{height: 500}}>
      <WindowedListRenderer
        length={1000}
        type={constants.VALID_TYPES.UNIFORM}
      />
    </div>
  );

  t.snapshot(toJson(wrapper));

  const container = wrapper
    .children()
    .children()
    .children();

  t.deepEqual(container.prop('style'), {
    position: 'relative'
  });

  const listContainer = container.children();

  t.deepEqual(listContainer.prop('style'), {
    msTransform: 'translate(0px, 0px)',
    transform: 'translate(0px, 0px)',
    WebkitTransform: 'translate(0px, 0px)'
  });
});
