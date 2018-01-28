// test
import test from 'ava';
import React from 'react';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

// src
import * as component from 'src/WindowedList';

const WindowedList = component.default;

test('if getVisibleRange will execute the same method on the original component', (t) => {
  const visibleRange = [0, 10];

  const instance = {
    ref: {
      originalComponent: {
        getVisibleRange: sinon.stub().returns(visibleRange)
      }
    }
  };

  const getVisibleRange = component.createGetVisibleRange(instance);

  const result = getVisibleRange();

  t.true(instance.ref.originalComponent.getVisibleRange.calledOnce);

  t.is(result, visibleRange);
});

test('if getVisibleRange will return a default when originalComponent does not exist on the ref', (t) => {
  const instance = {
    ref: {}
  };

  const getVisibleRange = component.createGetVisibleRange(instance);

  const result = getVisibleRange();

  t.deepEqual(result, [0, 0]);
});

test('if getVisibleRange will return a default when the ref does not exist', (t) => {
  const instance = {};

  const getVisibleRange = component.createGetVisibleRange(instance);

  const result = getVisibleRange();

  t.deepEqual(result, [0, 0]);
});

test('if scrollAround will execute the same method on the original component', (t) => {
  const index = 10;

  const instance = {
    ref: {
      originalComponent: {
        scrollAround: sinon.spy()
      }
    }
  };

  const scrollAround = component.createScrollAround(instance);

  scrollAround(index);

  t.true(instance.ref.originalComponent.scrollAround.calledOnce);
  t.true(instance.ref.originalComponent.scrollAround.calledWith(index));
});

test('if scrollAround will not throw when there is no original component', (t) => {
  const index = 10;

  const instance = {
    ref: {}
  };

  const scrollAround = component.createScrollAround(instance);

  t.notThrows(() => {
    scrollAround(index);
  });
});

test('if scrollAround will not throw when there is no ref', (t) => {
  const index = 10;

  const instance = {};

  const scrollAround = component.createScrollAround(instance);

  t.notThrows(() => {
    scrollAround(index);
  });
});

test('if scrollTo will execute the same method on the original component', (t) => {
  const index = 10;

  const instance = {
    ref: {
      originalComponent: {
        scrollTo: sinon.spy()
      }
    }
  };

  const scrollTo = component.createScrollTo(instance);

  scrollTo(index);

  t.true(instance.ref.originalComponent.scrollTo.calledOnce);
  t.true(instance.ref.originalComponent.scrollTo.calledWith(index));
});

test('if scrollTo will not throw when there is no original component', (t) => {
  const index = 10;

  const instance = {
    ref: {}
  };

  const scrollTo = component.createScrollTo(instance);

  t.notThrows(() => {
    scrollTo(index);
  });
});

test('if scrollTo will not throw when there is no ref', (t) => {
  const index = 10;

  const instance = {};

  const scrollTo = component.createScrollTo(instance);

  t.notThrows(() => {
    scrollTo(index);
  });
});

test('if WindowedList renders correctly with default props', (t) => {
  const props = {};

  const wrapper = shallow(<WindowedList {...props} />);

  t.snapshot(toJson(wrapper));
});
