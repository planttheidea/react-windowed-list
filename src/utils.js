// external dependencies
import React from 'react';

// constants
import {
  CLIENT_START_KEYS,
  CLIENT_SIZE_KEYS,
  DEFAULT_CONTAINER_STYLE,
  INNER_SIZE_KEYS,
  OFFSET_START_KEYS,
  OFFSET_SIZE_KEYS,
  SCROLL_SIZE_KEYS,
  SIZE_KEYS,
  VALID_AXES,
  VALID_TYPES
} from './constants';

/**
 * @function isFunction
 *
 * @description
 * is the object passed a function
 *
 * @param {*} object the object to test
 * @returns {boolean} is teh object a function
 */
export const isFunction = (object) => typeof object === 'function';

/**
 * @function isNAN
 *
 * @description
 * is the object passed a NaN
 *
 * @param {*} object the object to test
 * @returns {boolean} is teh object a NaN
 */
export const isNAN = (object) => object !== object;

/**
 * @function isNumber
 *
 * @description
 * is the object passed a number
 *
 * @param {*} object the object to test
 * @returns {boolean} is teh object a number
 */
export const isNumber = (object) => typeof object === 'number';

/**
 * @function noop
 *
 * @description
 * a no-op method
 */
export const noop = () => {};

/**
 * @function areStateValuesEqual
 *
 * @description
 * should the state be updated based on the values of nextPossibleState being different
 *
 * @param {Object} currentState the current state of the instance
 * @param {Object} nextPossibleState the state to apply
 * @returns {boolean} should the state be updated
 */
export const areStateValuesEqual = (currentState, nextPossibleState) => {
  const nextStateKeys = Object.keys(nextPossibleState);

  let key;

  for (let index = 0; index < nextStateKeys.length; index++) {
    key = nextStateKeys[index];

    if (currentState[key] !== nextPossibleState[key]) {
      return false;
    }
  }

  return true;
};

/**
 * @function coalesceToZero
 *
 * @description
 * return the value if truthy, else zero
 *
 * @param {*} value the value to compare
 * @returns {*} the value or zero
 */
export const coalesceToZero = (value) => value || 0;

/**
 * @function DefaultItemRenderer
 *
 * @description
 * the default method to create the item element
 *
 * @param {number} index the index of the item in the list
 * @param {number} key the key to provide to the item
 * @returns {ReactElement} the generated element
 */
export const DefaultItemRenderer = (index, key) => <div key={key}>{index}</div>;

/**
 * @function DefaultContainerRenderer
 *
 * @description
 * the default method to create the list container
 *
 * @param {Array<ReactElement>} items the items to render in the list
 * @param {function} ref the ref to provide to the list container
 * @returns {ReactElement} the generated element
 */
export const DefaultContainerRenderer = (items, ref) => <div ref={ref}>{items}</div>;

/**
 * @function getOffset
 *
 * @description
 * get the offset of the element based on its position and axis
 *
 * @param {HTMLElement} element the element to get the offset of
 * @param {string} axis the axis of the component
 * @returns {number} the element offset requested
 */
export const getOffset = (element, axis) => {
  const offsetKey = OFFSET_START_KEYS[axis];

  let offset = coalesceToZero(element[CLIENT_START_KEYS[axis]]) + coalesceToZero(element[offsetKey]);

  while ((element = element.offsetParent)) {
    offset += coalesceToZero(element[offsetKey]);
  }

  return offset;
};

/**
 * @function getCalculatedElementEnd
 *
 * @description
 * get the pixel size of the window based on the last element in the list of elements passed
 *
 * @param {Array<HTMLElement>} elements the elements displayed
 * @param {string} axis the axis of the component
 * @returns {number} the pixel size of the window
 */
export const getCalculatedElementEnd = (elements, {axis}) => {
  if (!elements.length) {
    return 0;
  }

  const firstItemEl = elements[0];
  const lastItemEl = elements[elements.length - 1];

  return getOffset(lastItemEl, axis) + lastItemEl[OFFSET_SIZE_KEYS[axis]] - getOffset(firstItemEl, axis);
};

/**
 * @function getCalculatedSpaceBefore
 *
 * @description
 * get the space before the given length
 *
 * @param {Object} cache the cache of sizes in the instance
 * @param {number} length the length of items to get the space of
 * @param {function} getSizeOfListItem the method to get the size of the list item
 * @returns {number} the space before the given length
 */
export const getCalculatedSpaceBefore = (cache, length, getSizeOfListItem) => {
  let from = length;

  while (from > 0 && !isNumber(cache[from])) {
    --from;
  }

  let space = coalesceToZero(cache[from]),
      itemSize;

  for (let index = from; index < length; index++) {
    cache[index] = space;
    itemSize = getSizeOfListItem(index);

    if (!isNumber(itemSize)) {
      break;
    }

    space += itemSize;
  }

  return space;
};

/**
 * @function getCalculatedItemSizeAndItemsPerRow
 *
 * @description
 * get the itemSize and itemsPerRow properties based on the elements passed
 *
 * @NOTE
 * Firefox has a problem where it will return a *slightly* (less than
 * thousandths of a pixel) different size for the same element between
 * renders. instance can cause an infinite render loop, so only change the
 * itemSize when it is significantly different.
 *
 * @param {Array<HTMLElement>} elements the elements to get the itemSize for
 * @param {string} axis the axis of the component
 * @param {number} currentItemSize the itemSize currently in state
 * @returns {{itemSize: number, itemsPerRow: number}} the new itemSize and itemsPerRow properties
 */
export const getCalculatedItemSizeAndItemsPerRow = (elements, axis, currentItemSize) => {
  const firstEl = elements[0];
  const firstElSize = firstEl[OFFSET_SIZE_KEYS[axis]];
  const delta = Math.abs(firstElSize - currentItemSize);

  let itemSize = isNAN(delta) || delta > 0 ? firstElSize : currentItemSize;

  if (!itemSize) {
    return {};
  }

  const startKey = OFFSET_START_KEYS[axis];
  const firstStart = firstEl[startKey];

  let itemsPerRow = 1,
      item = elements[itemsPerRow];

  while (item && item[startKey] === firstStart) {
    item = elements[++itemsPerRow];
  }

  return {
    itemSize,
    itemsPerRow
  };
};

export const getInnerContainerStyle = (axis, length, itemsPerRow, getSize) => {
  const size = getSize(Math.ceil(length / itemsPerRow) * itemsPerRow, {});

  if (!size) {
    return DEFAULT_CONTAINER_STYLE;
  }

  const axisKey = SIZE_KEYS[axis];

  return axis !== VALID_AXES.X
    ? {
      ...DEFAULT_CONTAINER_STYLE,
      [axisKey]: size
    }
    : {
      ...DEFAULT_CONTAINER_STYLE,
      [axisKey]: size,
      overflowX: 'hidden'
    };
};

/**
 * @function getFromAndSize
 *
 * @description
 * calculate the from and size values based on the number of items per row
 *
 * @param {number} currentFrom the current from in state
 * @param {number} currentSize the current size in state
 * @param {number} itemsPerRow the number of items per row in state
 * @param {boolean} isLazy is the list lazily loaded
 * @param {number} length the total number of items
 * @param {number} pageSize the size of batches to render
 * @param {string} type the type of list
 * @returns {{from: number, size: number}} the from and size propertioes
 */
export const getFromAndSize = (currentFrom, currentSize, itemsPerRow, {isLazy, length, minSize, pageSize, type}) => {
  const comparator = Math.max(minSize, isLazy && type === VALID_TYPES.UNIFORM ? 1 : pageSize);

  let size = Math.max(currentSize, comparator),
      mod = size % itemsPerRow;

  if (mod) {
    size += itemsPerRow - mod;
  }

  if (size > length) {
    size = length;
  }

  let from = !currentFrom || type === VALID_TYPES.SIMPLE ? 0 : Math.max(Math.min(currentFrom, length - size), 0);

  if ((mod = from % itemsPerRow)) {
    from -= mod;
    size += mod;
  }

  return {
    from,
    size
  };
};

/**
 * @function getFromAndSizeFromListItemSize
 *
 * @description
 * get the from and size properties based on the size of the list items
 *
 * @param {Object} startAndEnd the object with starting and ending indices of the displayed window
 * @param {number} startAndEnd.end the ending index of the items to display
 * @param {number} startAndEnd.start the starting index of the items to display
 * @param {Object} props the current props of the component
 * @param {number} props.length the total size of the list
 * @param {number} props.pageSize the side of the page to display
 * @param {function} getSizeOfListItem the method to get the size of the list item
 * @param {Object} currentState the current state's from and size
 * @returns {{from: number, size: number}} the from and size properties
 */
export const getFromAndSizeFromListItemSize = ({end, start}, {length, pageSize}, getSizeOfListItem, currentState) => {
  const maxFrom = length - 1;

  let space = 0,
      from = 0,
      size = -1,
      itemSize;

  for (; from < maxFrom; from++) {
    itemSize = getSizeOfListItem(from);

    if (!isNumber(itemSize) || space + itemSize > start) {
      /**
       * @NOTE
       * if an alternative key is used, it causes jitter when the first item is removed from the DOM,
       * so render the first item if the calculated from is 1
       */
      if (from === 1) {
        from = 0;
      }

      break;
    }

    space += itemSize;
  }

  const maxSize = length - from;

  while (++size < maxSize && space < end) {
    itemSize = getSizeOfListItem(from + size);

    if (!isNumber(itemSize)) {
      size = Math.min(size + pageSize, maxSize);

      break;
    }

    space += itemSize;
  }

  return space
    ? {
      from,
      size
    }
    : currentState;
};

/**
 * @function getListContainerStyle
 *
 * @description
 * get the style object to provide to the list container
 *
 * @param {string} axis the axis of the component
 * @param {string} usePosition should position be used instead of the transform
 * @param {string} useTranslate3d should translate3d be used for the transform
 * @param {number} firstIndex the first index being rendered
 * @param {function} getOffset the method to get the offset value
 * @returns {Object} the style object for the list container
 */
export const getListContainerStyle = (axis, usePosition, useTranslate3d, firstIndex, getOffset) => {
  const offset = getOffset(firstIndex, {});
  const x = axis === VALID_AXES.X ? offset : 0;
  const y = axis === VALID_AXES.Y ? offset : 0;

  if (usePosition) {
    return {
      left: x,
      position: 'relative',
      top: y
    };
  }

  const transform = useTranslate3d ? `translate3d(${x}px, ${y}px, 0)` : `translate(${x}px, ${y}px)`;

  return {
    msTransform: transform,
    WebkitTransform: transform,
    transform
  };
};

/**
 * @function getScrollSize
 *
 * @description
 * get the scroll size of the element
 *
 * @param {HTMLElement} element the element to get the scroll size of
 * @param {string} axis the axis of the component
 * @returns {number} the scroll size of the element
 */
export const getScrollSize = (element, axis) =>
  element === window
    ? Math.max(document.body[SCROLL_SIZE_KEYS[axis]], document.documentElement[SCROLL_SIZE_KEYS[axis]])
    : element[SCROLL_SIZE_KEYS[axis]];

/**
 * @function getViewportSize
 *
 * @description
 * get the viewport size of the element
 *
 * @param {HTMLElement} element the element to get the viewport size of
 * @param {string} axis the axis of the component
 * @returns {number} the viewport size of the element
 */
export const getViewportSize = (element, axis) =>
  element ? (element === window ? window[INNER_SIZE_KEYS[axis]] : element[CLIENT_SIZE_KEYS[axis]]) : 0;

/**
 * @function hasDeterminateSize
 *
 * @description
 * does the element have a predetermined size calculator
 *
 * @param {string} type the type of the component
 * @param {function} [itemSizeGetter] the function to calculate the item size
 * @returns {boolean} is the size automatically determined
 */
export const hasDeterminateSize = (type, itemSizeGetter) => type === VALID_TYPES.UNIFORM || isFunction(itemSizeGetter);

/**
 * @function setCacheSizes
 *
 * @description
 * set the rendered sizes in cache on the instance
 *
 * @param {number} from the first index to set the cache of
 * @param {HTMLElement} element the list element
 * @param {string} axis the axis of the component
 * @param {Object} cache the cache to save to
 */
export const setCacheSizes = (from, element, axis, cache) => {
  const itemElements = element.children;
  const sizeKey = OFFSET_SIZE_KEYS[axis];

  for (let index = 0; index < itemElements.length; index++) {
    cache[from + index] = itemElements[index][sizeKey];
  }
};
