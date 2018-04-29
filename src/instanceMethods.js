// external dependencies
import debounce from 'debounce';
import raf from 'raf';
import {findDOMNode} from 'react-dom';

// constants
import {
  OFFSET_SIZE_KEYS,
  OVERFLOW_KEYS,
  OVERFLOW_VALUES,
  SCROLL_START_KEYS,
  ADD_EVENT_LISTENER_OPTIONS,
  VALID_TYPES
} from './constants';

// utils
import {
  areStateValuesEqual,
  getCalculatedElementEnd,
  getCalculatedItemSizeAndItemsPerRow,
  getCalculatedSpaceBefore,
  getFromAndSize,
  getFromAndSizeFromListItemSize,
  getOffset,
  getScrollSize,
  getViewportSize,
  hasDeterminateSize,
  isFunction,
  isNumber,
  noop,
  setCacheSizes
} from './utils';

/**
 * @function getItemSizeAndItemsPerRow
 *
 * @description
 * get the itemSize and itemsPerRow values based on props
 *
 * @param {Array<ReactElement>} items the items passed
 * @param {string} axis the axis being scrolled on
 * @param {boolean} useStaticSize should a static size be used
 * @param {number} itemSize the current size of the item in state
 * @param {number} itemsPerRow the current number of rows in state
 * @returns {Object} the itemSize and itemsPerRow
 */
export const getItemSizeAndItemsPerRow = ({items, props: {axis, useStaticSize}, state: {itemSize, itemsPerRow}}) => {
  if (useStaticSize && itemSize && itemsPerRow) {
    return {
      itemSize,
      itemsPerRow
    };
  }

  const itemElements = items ? items.children : [];

  return itemElements.length ? getCalculatedItemSizeAndItemsPerRow(itemElements, axis, itemSize) : {};
};

/**
 * @function getScrollOffset
 *
 * @description
 * get the scroll offset based on props
 *
 * @param {HTMLElement} outerContainer the outer container
 * @param {string} axis the axis being scrolled on
 * @param {HTMLElement} scrollParent the parent being scrolled
 * @returns {number} the scrollOffset to apply
 */
export const getScrollOffset = ({outerContainer, props: {axis}, scrollParent}) => {
  if (!outerContainer || !scrollParent) {
    return 0;
  }

  const scrollKey = SCROLL_START_KEYS[axis];
  const actual =
    scrollParent === window ? document.body[scrollKey] || document.documentElement[scrollKey] : scrollParent[scrollKey];

  const max = getScrollSize(scrollParent, axis) - getViewportSize(scrollParent, axis);
  const scroll = Math.max(0, Math.min(actual, max));

  return getOffset(scrollParent, axis) + scroll - getOffset(outerContainer, axis);
};

/**
 * @function getScrollParent
 *
 * @description
 * get the scroll parent element
 *
 * @param {HTMLElement} outerContainer the outer container
 * @param {string} axis the axis being scrolled on
 * @param {function} scrollParentGetter the method to get the scrollParent
 * @returns {HTMLElement} the scroll parent
 */
export const getScrollParent = ({outerContainer, props: {axis, scrollParentGetter}}) => {
  if (isFunction(scrollParentGetter)) {
    return scrollParentGetter();
  }

  if (!outerContainer) {
    return null;
  }

  const overflowKey = OVERFLOW_KEYS[axis];

  let element = outerContainer;

  while ((element = element.parentElement)) {
    if (~OVERFLOW_VALUES.indexOf(window.getComputedStyle(element)[overflowKey])) {
      return element;
    }
  }

  return window;
};

/**
 * @function getSizeOfListItem
 *
 * @description
 * get the size of the list item requested
 *
 * @param {Object} cache the current cache in state
 * @param {Array<ReactElement>} items the items rendered
 * @param {string} axis the axis being scrolled on
 * @param {function} itemSizeEstimator the method used to estimate the item size
 * @param {function} itemSizeGetter the method used to get the item size
 * @param {string} type the list type
 * @param {number} from the first index being rendered
 * @param {number} itemSize the size of each item
 * @param {number} size the number of items being rendered
 * @param {number} index the index of the list item
 * @returns {number} the size of the list item
 */
export const getSizeOfListItem = (
  {cache, items, props: {axis, itemSizeEstimator, itemSizeGetter, type}, state: {from, itemSize, size}},
  [index]
) => {
  // Try the static itemSize.
  if (itemSize) {
    return itemSize;
  }

  // Try the itemSizeGetter.
  if (isFunction(itemSizeGetter)) {
    return itemSizeGetter(index);
  }

  // Try the cache.
  if (isNumber(cache[index])) {
    return cache[index];
  }

  if (items) {
    const itemElements = items.children;

    // Try the DOM.
    if (itemElements.length && type === VALID_TYPES.SIMPLE && index >= from && index < from + size) {
      const itemEl = itemElements[index - from];

      if (itemEl) {
        return itemEl[OFFSET_SIZE_KEYS[axis]];
      }
    }
  }

  // Try the itemSizeEstimator.
  if (isFunction(itemSizeEstimator)) {
    return itemSizeEstimator(index, cache);
  }
};

/**
 * @function getSpaceBefore
 *
 * @description
 * get the space before the item requested
 *
 * @param {function} getSizeOfListItem method to get the size of the item
 * @param {number} itemSize the size of each item
 * @param {number} itemsPerRow the number of items per row
 * @param {number} index the index of the item requested
 * @param {Object} [cache={}] the instance cache
 * @returns {number} the space before the item requested
 */
export const getSpaceBefore = ({getSizeOfListItem, state: {itemSize, itemsPerRow}}, [index, cache = {}]) => {
  if (isNumber(cache[index])) {
    return cache[index];
  }

  cache[index] = itemSize
    ? Math.floor(index / itemsPerRow) * itemSize
    : getCalculatedSpaceBefore(cache, index, getSizeOfListItem);

  return cache[index];
};

/**
 * @function getStartAndEnd
 *
 * @description
 * get the start and end values based on scroll position
 *
 * @param {function} getScrollOffset the method to get the scroll offset
 * @param {function} getSpaceBefore the method to get the space before the first rendered item
 * @param {string} axis the scroll axis
 * @param {function} itemSizeGetter the method used to get the item size
 * @param {number} length the number of total items
 * @param {number} defaultThreshold the threshold value
 * @param {string} type the type of renderer used
 * @param {number} [threshold=defaultThreshold] the pixel threshold to scroll above and below
 * @returns {{end: number, start: number}} the start and end of the window
 */
export const getStartAndEnd = (
  {
    getScrollOffset,
    getSpaceBefore,
    props: {axis, itemSizeGetter, length, threshold: defaultThreshold, type},
    scrollParent
  },
  [threshold = defaultThreshold]
) => {
  const scroll = getScrollOffset();
  const calculatedEnd = scroll + getViewportSize(scrollParent, axis) + threshold;

  return {
    end: hasDeterminateSize(type, itemSizeGetter) ? Math.min(calculatedEnd, getSpaceBefore(length)) : calculatedEnd,
    start: Math.max(0, scroll - threshold)
  };
};

/**
 * @function getVisibleRange
 *
 * @description
 * get the indices of the first and last items that are visible in the viewport
 *
 * @returns {Array<number>} the first and last index of the visible items
 */
export const getVisibleRange = ({getSizeOfListItem, getSpaceBefore, getStartAndEnd, state: {from, size}}) => {
  const {end, start} = getStartAndEnd(0);

  const cache = {};
  const length = from + size;

  let first, last, itemStart, itemEnd;

  for (let index = from; index < length; index++) {
    itemStart = getSpaceBefore(index, cache);
    itemEnd = itemStart + getSizeOfListItem(index);

    if (!isNumber(first)) {
      if (itemEnd > start) {
        first = index;
      }
    } else if (itemStart < end) {
      last = index;
    }
  }

  return [first, last];
};

/**
 * @function renderItems
 *
 * @description
 * render the items that are currently visible
 *
 * @param {ReactComponent} instance the component instance
 * @returns {ReactElement} the rendered container with the items
 */
export const renderItems = (instance) => {
  const {
    props: {itemRenderer, containerRenderer},
    state: {from, size}
  } = instance;

  let items = new Array(size);

  for (let index = 0; index < size; index++) {
    items[index] = itemRenderer(from + index, index);
  }

  return containerRenderer(items, (containerRef) => (instance.items = findDOMNode(containerRef)));
};

/**
 * @function scrollAround
 *
 * @description
 * scroll to a point that the item is within the window, but not necessarily at the top
 *
 * @param {number} index the index to scroll to in the window
 * @returns {void}
 */
export const scrollAround = (
  {getScrollOffset, getSizeOfListItem, getSpaceBefore, getViewportSize, setScroll},
  [index]
) => {
  const bottom = getSpaceBefore(index);
  const top = bottom - getViewportSize() + getSizeOfListItem(index);

  const min = Math.min(top, bottom);
  const current = getScrollOffset();

  if (current <= min) {
    return setScroll(min);
  }

  const max = Math.max(top, bottom);

  if (current > max) {
    return setScroll(max);
  }
};

/**
 * @function scrollTo
 *
 * @description
 * scroll the element to the requested initialIndex
 *
 * @param {number} index the index to scroll to
 */
export const scrollTo = ({getSpaceBefore, props: {initialIndex}, setScroll}, [index]) => {
  const indexToScrollTo = isNumber(index) ? index : initialIndex;

  if (isNumber(indexToScrollTo)) {
    setScroll(getSpaceBefore(indexToScrollTo));
  }
};

/**
 * @function setReconcileFrameAfterUpdate
 *
 * @description
 * set the frame reconciler used after componentDidUpdate
 *
 * @param {ReactComponent} instance the component instance
 */
export const setReconcileFrameAfterUpdate = (instance) => {
  const {debounceReconciler} = instance.props;

  instance.reconcileFrameAfterUpdate = isNumber(debounceReconciler)
    ? debounce((updateFrame) => {
      updateFrame();
    }, debounceReconciler)
    : raf;
};

/**
 * @function setScroll
 *
 * @description
 * set the scroll based on the current offset
 *
 * @param {number} currentOffset the current offset
 * @returns {void}
 */
export const setScroll = ({outerContainer, props: {axis}, scrollParent}, [currentOffset]) => {
  if (!scrollParent || !outerContainer) {
    return;
  }

  const offset = currentOffset + getOffset(outerContainer, axis);

  if (scrollParent === window) {
    return window.scrollTo(0, offset);
  }

  scrollParent[SCROLL_START_KEYS[axis]] = offset - getOffset(scrollParent, axis);
};

/**
 * @function setStateIfAppropriate
 *
 * @description
 * set the state if areStateValuesEqual returns true
 *
 * @param {Object} nextState the possible next state of the instance
 * @param {function} callback the callback to call once the state is set
 * @returns {void}
 */
export const setStateIfAppropriate = ({setState, state}, [nextState, callback]) =>
  areStateValuesEqual(state, nextState) ? callback() : setState(nextState, callback);

/**
 * @function updateFrame
 *
 * @description
 * update the frame based on the type in props
 *
 * @param {function} callback the function to call once the frame is updated
 * @returns {void}
 */
export const updateFrame = (
  {props: {type}, updateScrollParent, updateSimpleFrame, updateUniformFrame, updateVariableFrame},
  [callback]
) => {
  updateScrollParent();

  const updateCallback = isFunction(callback) ? callback : noop;

  return type === VALID_TYPES.UNIFORM
    ? updateUniformFrame(updateCallback)
    : type === VALID_TYPES.VARIABLE
      ? updateVariableFrame(updateCallback)
      : updateSimpleFrame(updateCallback);
};

/**
 * @function updateScrollParent
 *
 * @description
 * update the scroll parent with the listeners it needs
 *
 * @param {ReactComponent} instance the component instance
 * @returns {void}
 */
export const updateScrollParent = (instance) => {
  const {getScrollParent, scrollParent, updateFrame} = instance;

  const newScrollParent = getScrollParent();

  if (newScrollParent === scrollParent) {
    return;
  }

  if (scrollParent) {
    scrollParent.removeEventListener('scroll', updateFrame);
    scrollParent.removeEventListener('mousewheel', noop);
  }

  instance.scrollParent = newScrollParent;

  if (newScrollParent) {
    newScrollParent.addEventListener('scroll', updateFrame, ADD_EVENT_LISTENER_OPTIONS);
    newScrollParent.addEventListener('mousewheel', noop, ADD_EVENT_LISTENER_OPTIONS);
  }
};

/**
 * @function updateSimpleFrame
 *
 * @description
 * update the frame when the type is 'simple'
 *
 * @param {function} callback the function to call once the frame is updated
 * @returns {void}
 */
export const updateSimpleFrame = ({getStartAndEnd, items, props, setStateIfAppropriate, state: {size}}, [callback]) =>
  items && getCalculatedElementEnd(items.children, props) <= getStartAndEnd().end
    ? setStateIfAppropriate(
      {
        size: Math.min(size + props.pageSize, props.length)
      },
      callback
    )
    : callback();

/**
 * @function updateUniformFrame
 *
 * @description
 * update the frame when the type is 'uniform'
 *
 * @param {function} callback the function to call once the frame is updated
 * @returns {void}
 */
export const updateUniformFrame = (
  {getItemSizeAndItemsPerRow, getStartAndEnd, props, setStateIfAppropriate},
  [callback]
) => {
  const {itemSize, itemsPerRow} = getItemSizeAndItemsPerRow();

  if (!itemSize || !itemsPerRow) {
    return callback();
  }

  const {start, end} = getStartAndEnd();

  const calculatedFrom = Math.floor(start / itemSize) * itemsPerRow;
  const calulatedSize = (Math.ceil((end - start) / itemSize) + 1) * itemsPerRow;
  const fromAndSize = getFromAndSize(calculatedFrom, calulatedSize, itemsPerRow, props);

  return setStateIfAppropriate(
    {
      ...fromAndSize,
      itemSize,
      itemsPerRow
    },
    callback
  );
};

/**
 * @function updateVariableFrame
 *
 * @description
 * update the frame when the type is 'variable'
 *
 * @param {function} callback the function to call once the frame is updated
 * @returns {void}
 */
export const updateVariableFrame = (
  {
    cache,
    items,
    getSizeOfListItem,
    getStartAndEnd,
    props,
    setStateIfAppropriate,
    state: {from: currentFrom, size: currentSize}
  },
  [callback]
) => {
  if (!items) {
    return;
  }

  if (!props.itemSizeGetter) {
    setCacheSizes(currentFrom, items, props.axis, cache);
  }

  setStateIfAppropriate(
    getFromAndSizeFromListItemSize(getStartAndEnd(), props, getSizeOfListItem, {
      from: currentFrom,
      size: currentSize
    }),
    callback
  );
};
