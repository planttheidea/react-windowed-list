// test
import test from 'ava';
import {
  shallow
} from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';
import * as constants from 'src/constants';

test('if areStateValuesEqual will return true when the values from the nextPossibleState are equal to those in the currentState', (t) => {
  const currentState = {
    foo: 'bar',
    bar: 'baz',
    baz: 'foo'
  };
  const nextPossibleState = {
    foo: 'bar'
  };

  t.true(utils.areStateValuesEqual(currentState, nextPossibleState));
});

test('if areStateValuesEqual will return false when the values from the nextPossibleState are not equal to those in the currentState', (t) => {
  const currentState = {
    foo: 'bar',
    bar: 'baz',
    baz: 'foo'
  };
  const nextPossibleState = {
    foo: 'baz'
  };

  t.false(utils.areStateValuesEqual(currentState, nextPossibleState));
});

test('if defaultItemRenderer will render the item', (t) => {
  const index = 2;
  const key = 'foo';

  const element = utils.defaultItemRenderer(index, key);
  const wrapper = shallow(element);

  t.snapshot(toJson(wrapper));
});

test('if defaultContainerRenderer will render the item', (t) => {
  const items = [
    'foo',
    'bar',
    'baz'
  ];
  const ref = sinon.spy();

  const element = utils.defaultContainerRenderer(items, ref);
  const wrapper = shallow(element);

  t.snapshot(toJson(wrapper));
});

test('if getOffset will get the total offset from the element', (t) => {
  const axis = 'y';
  const offsetKey = constants.OFFSET_START_KEYS[axis];
  const element = {
    [constants.CLIENT_START_KEYS[axis]]: 100,
    offsetParent: {
      [offsetKey]: 10,
      offsetParent: {
        [offsetKey]: 10,
        offsetParent: {
          [offsetKey]: 10
        }
      }
    }
  };

  const result = utils.getOffset(element, axis);

  t.is(result, 130);
});

test('if getCalculatedElementEnd returns 0 when elements do not have length', (t) => {
  const elements = [];
  const props = {
    axis: 'y'
  };

  const result = utils.getCalculatedElementEnd(elements, props);

  t.is(result, 0);
});

test('if getCalculatedElementEnd calculates the correct end based on offset of the first and last element', (t) => {
  const axis = 'y';
  const elements = [
    {
      [constants.OFFSET_SIZE_KEYS[axis]]: 50,
      [constants.OFFSET_START_KEYS[axis]]: 10
    },
    {
      [constants.OFFSET_SIZE_KEYS[axis]]: 10,
      [constants.OFFSET_START_KEYS[axis]]: 0
    },
    {
      [constants.OFFSET_SIZE_KEYS[axis]]: 40,
      [constants.OFFSET_START_KEYS[axis]]: 20
    },
    {
      [constants.OFFSET_SIZE_KEYS[axis]]: 60,
      [constants.OFFSET_START_KEYS[axis]]: 10
    },
    {
      [constants.OFFSET_SIZE_KEYS[axis]]: 15,
      [constants.OFFSET_START_KEYS[axis]]: 5
    },
    {
      [constants.OFFSET_SIZE_KEYS[axis]]: 40,
      [constants.OFFSET_START_KEYS[axis]]: 30
    }
  ];
  const props = {
    axis
  };

  const result = utils.getCalculatedElementEnd(elements, props);
  const expectedResult = elements[elements.length - 1][constants.OFFSET_START_KEYS[axis]] +
    elements[elements.length - 1][constants.OFFSET_SIZE_KEYS[axis]] -
    elements[0][constants.OFFSET_START_KEYS[axis]];

  t.is(result, expectedResult);
});


test('if getCalculatedSpaceBefore will calculate the correct space before with no cache', (t) => {
  const cache = {};
  const length = 10;
  const itemSize = 30;
  const getSizeOfListItem = sinon.stub().returns(itemSize);

  const result = utils.getCalculatedSpaceBefore(cache, length, getSizeOfListItem);

  t.is(result, itemSize * (length - 1));
});

test('if getCalculatedSpaceBefore will calculate the correct space before with some cach cache', (t) => {
  const cache = {
    0: 30,
    1: 30,
    2: 30
  };
  const length = 10;
  const itemSize = 30;
  const getSizeOfListItem = sinon.stub().returns(itemSize);

  const result = utils.getCalculatedSpaceBefore(cache, length, getSizeOfListItem);

  t.is(result, itemSize * (length - 2));
});

test('if getCalculatedItemSizeAndItemsPerRow correctly calculated itemSize and itemsPerRow when the different is a number greater than 0', (t) => {
  const axis = 'y';
  const itemSize = 100;
  const elements = [
    {[constants.OFFSET_SIZE_KEYS[axis]]: itemSize},
    {[constants.OFFSET_SIZE_KEYS[axis]]: itemSize},
    {[constants.OFFSET_SIZE_KEYS[axis]]: itemSize}
  ];
  const currentItemSize = 50;

  const result = utils.getCalculatedItemSizeAndItemsPerRow(elements, axis, currentItemSize);

  t.deepEqual(result, {
    itemSize,
    itemsPerRow: elements.length
  });
});

test('if getCalculatedItemSizeAndItemsPerRow returns an empty object when there is no size', (t) => {
  const axis = 'y';
  const itemSize = 0;
  const elements = [
    {[constants.OFFSET_SIZE_KEYS[axis]]: itemSize}
  ];
  const currentItemSize = 50;

  const result = utils.getCalculatedItemSizeAndItemsPerRow(elements, axis, currentItemSize);

  t.deepEqual(result, {});
});

test('if getContainerStyle returns the DEFAULT_CONTAINER_STYLE when there is no size', (t) => {
  const axis = 'y';
  const size = 0;

  const result = utils.getContainerStyle(axis, size);

  t.is(result, constants.DEFAULT_CONTAINER_STYLE);
});

test('if getContainerStyle returns the correct style when there is size and the axis is y', (t) => {
  const axis = 'y';
  const size = 500;

  const result = utils.getContainerStyle(axis, size);

  t.deepEqual(result, {
    ...constants.DEFAULT_CONTAINER_STYLE,
    [constants.SIZE_KEYS[axis]]: size
  });
});

test('if getContainerStyle returns the correct style when there is size and the axis is x', (t) => {
  const axis = 'x';
  const size = 500;

  const result = utils.getContainerStyle(axis, size);

  t.deepEqual(result, {
    ...constants.DEFAULT_CONTAINER_STYLE,
    [constants.SIZE_KEYS[axis]]: size,
    overflowX: 'hidden'
  });
});

test('if getFromAndSize will calculate the correct from and size based on simple type from 0', (t) => {
  const from = 0;
  const size = 100;
  const itemsPerRow = 1;
  const props = {
    initialIndex: 0,
    isLazy: false,
    length: 1000,
    minSize: 1,
    pageSize: 10,
    type: constants.VALID_TYPES.SIMPLE
  };

  const result = utils.getFromAndSize(from, size, itemsPerRow, props);

  t.deepEqual(result, {
    from,
    size
  });
});

test('if getFromAndSize will calculate the correct from and size based on simple type from 10', (t) => {
  const from = 10;
  const size = 100;
  const itemsPerRow = 1;
  const props = {
    isLazy: false,
    length: 1000,
    minSize: 1,
    pageSize: 10,
    type: constants.VALID_TYPES.SIMPLE
  };

  const result = utils.getFromAndSize(from, size, itemsPerRow, props);

  t.deepEqual(result, {
    from: 0,
    size
  });
});

test('if getFromAndSize will calculate the correct from and size based on variable type from 0', (t) => {
  const from = 0;
  const size = 100;
  const itemsPerRow = 1;
  const props = {
    isLazy: false,
    length: 1000,
    minSize: 1,
    pageSize: 10,
    type: constants.VALID_TYPES.VARIABLE
  };

  const result = utils.getFromAndSize(from, size, itemsPerRow, props);

  t.deepEqual(result, {
    from,
    size
  });
});

test('if getFromAndSize will calculate the correct from and size based on variable type from 10', (t) => {
  const from = 10;
  const size = 100;
  const itemsPerRow = 1;
  const props = {
    isLazy: false,
    length: 1000,
    minSize: 1,
    pageSize: 10,
    type: constants.VALID_TYPES.VARIABLE
  };

  const result = utils.getFromAndSize(from, size, itemsPerRow, props);

  t.deepEqual(result, {
    from,
    size
  });
});

test('if getFromAndSize will calculate the correct from and size based on uniform type from 0', (t) => {
  const from = 0;
  const size = 100;
  const itemsPerRow = 1;
  const props = {
    isLazy: false,
    length: 1000,
    minSize: 1,
    pageSize: 10,
    type: constants.VALID_TYPES.UNIFORM
  };

  const result = utils.getFromAndSize(from, size, itemsPerRow, props);

  t.deepEqual(result, {
    from,
    size
  });
});

test('if getFromAndSize will calculate the correct from and size based on uniform type from 10', (t) => {
  const from = 10;
  const size = 100;
  const itemsPerRow = 1;
  const props = {
    isLazy: false,
    length: 1000,
    minSize: 1,
    pageSize: 10,
    type: constants.VALID_TYPES.UNIFORM
  };

  const result = utils.getFromAndSize(from, size, itemsPerRow, props);

  t.deepEqual(result, {
    from,
    size
  });
});

test('if getFromAndSize will calculate the correct from and size based on uniform type from 10 and minSize higher than size', (t) => {
  const from = 10;
  const size = 100;
  const minSize = size * 2;
  const itemsPerRow = 1;
  const props = {
    isLazy: false,
    length: 1000,
    minSize,
    pageSize: 10,
    type: constants.VALID_TYPES.UNIFORM
  };

  const result = utils.getFromAndSize(from, size, itemsPerRow, props);

  t.deepEqual(result, {
    from,
    size: minSize
  });
});

test('if getFromAndSizeFromListItemSize will calculate from and size based on start of 0 and end of 100', (t) => {
  const state = {
    end: 100,
    start: 0
  };
  const props = {
    length: 1000,
    pageSize: 10
  };
  const listItemSize = 20;
  const getSizeOfListItem = sinon.stub().returns(listItemSize);

  const result = utils.getFromAndSizeFromListItemSize(state, props, getSizeOfListItem);

  t.deepEqual(result, {
    from: 0,
    size: 5
  });
});

test('if getFromAndSizeFromListItemSize will calculate from and size based on start of 50 and end of 150', (t) => {
  const startAndend = {
    end: 150,
    start: 50
  };
  const props = {
    length: 1000,
    pageSize: 10
  };
  const listItemSize = 20;
  const getSizeOfListItem = sinon.stub().returns(listItemSize);

  const result = utils.getFromAndSizeFromListItemSize(startAndend, props, getSizeOfListItem);

  t.deepEqual(result, {
    from: 2,
    size: 6
  });
});

test('if getFromAndSizeFromListItemSize will return currentState if size calculated is 0', (t) => {
  const startAndend = {
    end: 150,
    start: 50
  };
  const props = {
    length: 1000,
    pageSize: 10
  };
  const state = {
    from: 0,
    size: 10
  };
  const listItemSize = 0;
  const getSizeOfListItem = sinon.stub().returns(listItemSize);

  const result = utils.getFromAndSizeFromListItemSize(startAndend, props, getSizeOfListItem, state);

  t.is(result, state);
});

test('if getListContainerStyle will return the correct style object when usePosition is true and the axis is x', (t) => {
  const axis = 'x';
  const usePosition = true;
  const useTranslate3d = false;
  const offset = 100;

  const result = utils.getListContainerStyle(axis, usePosition, useTranslate3d, offset);

  t.deepEqual(result, {
    left: offset,
    position: 'relative',
    top: 0
  });
});

test('if getListContainerStyle will return the correct style object when usePosition is true and the axis is y', (t) => {
  const axis = 'y';
  const usePosition = true;
  const useTranslate3d = false;
  const offset = 100;

  const result = utils.getListContainerStyle(axis, usePosition, useTranslate3d, offset);

  t.deepEqual(result, {
    left: 0,
    position: 'relative',
    top: offset
  });
});

test('if getListContainerStyle will return the correct style object when useTranslate3d is true and the axis is x', (t) => {
  const axis = 'x';
  const usePosition = false;
  const useTranslate3d = true;
  const offset = 100;

  const result = utils.getListContainerStyle(axis, usePosition, useTranslate3d, offset);

  const expectedTransform = `translate3d(${offset}px, 0px, 0)`;

  t.deepEqual(result, {
    msTransform: expectedTransform,
    WebkitTransform: expectedTransform,
    transform: expectedTransform
  });
});

test('if getListContainerStyle will return the correct style object when useTranslate3d is true and the axis is y', (t) => {
  const axis = 'y';
  const usePosition = false;
  const useTranslate3d = true;
  const offset = 100;

  const result = utils.getListContainerStyle(axis, usePosition, useTranslate3d, offset);

  const expectedTransform = `translate3d(0px, ${offset}px, 0)`;

  t.deepEqual(result, {
    msTransform: expectedTransform,
    WebkitTransform: expectedTransform,
    transform: expectedTransform
  });
});

test('if getListContainerStyle will return the correct style object when useTranslate3d is false and the axis is x', (t) => {
  const axis = 'x';
  const usePosition = false;
  const useTranslate3d = false;
  const offset = 100;

  const result = utils.getListContainerStyle(axis, usePosition, useTranslate3d, offset);

  const expectedTransform = `translate(${offset}px, 0px)`;

  t.deepEqual(result, {
    msTransform: expectedTransform,
    WebkitTransform: expectedTransform,
    transform: expectedTransform
  });
});

test('if getListContainerStyle will return the correct style object when useTranslate3d is false and the axis is y', (t) => {
  const axis = 'y';
  const usePosition = false;
  const useTranslate3d = false;
  const offset = 100;

  const result = utils.getListContainerStyle(axis, usePosition, useTranslate3d, offset);

  const expectedTransform = `translate(0px, ${offset}px)`;

  t.deepEqual(result, {
    msTransform: expectedTransform,
    WebkitTransform: expectedTransform,
    transform: expectedTransform
  });
});

test('if getScrollSize will get the scroll size of the document if the element is the window', (t) => {
  const axis = 'y';
  const key = constants.SCROLL_SIZE_KEYS[axis];
  const element = window;

  const result = utils.getScrollSize(element, axis);

  t.is(result, document.body[key]);
  t.is(result, document.documentElement[key]);
});

test('if getScrollSize will get the scroll size of the element if the element is not the window', (t) => {
  const axis = 'y';
  const key = constants.SCROLL_SIZE_KEYS[axis];
  const element = {
    [key]: 1000
  };

  const result = utils.getScrollSize(element, axis);

  t.is(result, element[key]);
});

test('if getViewportSize will get the window value for the right key if the element is the window', (t) => {
  const axis = 'y';
  const key = constants.INNER_SIZE_KEYS[axis];
  const element = window;

  const result = utils.getViewportSize(element, axis);

  t.is(result, window[key]);
});

test('if getViewportSize will get the value for the right key if the element is not the window', (t) => {
  const axis = 'y';
  const key = constants.CLIENT_SIZE_KEYS[axis];
  const element = {
    [key]: 1000
  };

  const result = utils.getViewportSize(element, axis);

  t.is(result, element[key]);
});

test('if hasDeterminateSize returns true if uniform', (t) => {
  const type = constants.VALID_TYPES.UNIFORM;
  const itemSizeGetter = () => {};

  t.true(utils.hasDeterminateSize(type, itemSizeGetter));
});

test('if hasDeterminateSize returns true if itemSizeGetter is a function', (t) => {
  const type = constants.VALID_TYPES.VARIABLE;
  const itemSizeGetter = () => {};

  t.true(utils.hasDeterminateSize(type, itemSizeGetter));
});

test('if hasDeterminateSize returns false otherwise', (t) => {
  const type = constants.VALID_TYPES.VARIABLE;
  const itemSizeGetter = null;

  t.false(utils.hasDeterminateSize(type, itemSizeGetter));
});

test('if setCacheSizes will assign the values from the children to cache', (t) => {
  const from = 5;
  const axis = 'y';
  const element = {
    children: [
      {[constants.OFFSET_SIZE_KEYS[axis]]: 100},
      {[constants.OFFSET_SIZE_KEYS[axis]]: 100},
      {[constants.OFFSET_SIZE_KEYS[axis]]: 100},
      {[constants.OFFSET_SIZE_KEYS[axis]]: 100},
      {[constants.OFFSET_SIZE_KEYS[axis]]: 100},
      {[constants.OFFSET_SIZE_KEYS[axis]]: 100},
      {[constants.OFFSET_SIZE_KEYS[axis]]: 100},
      {[constants.OFFSET_SIZE_KEYS[axis]]: 100},
      {[constants.OFFSET_SIZE_KEYS[axis]]: 100},
      {[constants.OFFSET_SIZE_KEYS[axis]]: 100}
    ]
  };
  const cache = {};

  utils.setCacheSizes(from, element, axis, cache);

  t.deepEqual(cache, {
    5: 100,
    6: 100,
    7: 100,
    8: 100,
    9: 100,
    10: 100,
    11: 100,
    12: 100,
    13: 100,
    14: 100
  });
});
