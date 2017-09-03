// external dependencies
import noop from 'lodash/noop';

/**
 * @constant {boolean} ADD_EVENT_LISTENER_OPTIONS
 * @default
 */
export const ADD_EVENT_LISTENER_OPTIONS = !(() => {
  if (typeof window === 'undefined') {
    return false;
  }

  let hasSupport = false;

  try {
    document.createElement('div').addEventListener('test', noop, {
      get passive() {
        hasSupport = true;

        return false;
      }
    });
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable */

  return hasSupport;
})()
  ? false
  : {
    passive: true
  };

/**
 * @constant {Object} CLIENT_SIZE_KEYS
 */
export const CLIENT_SIZE_KEYS = {
  x: 'clientWidth',
  y: 'clientHeight'
};

/**
 * @constant {Object} CLIENT_START_KEYS
 */
export const CLIENT_START_KEYS = {
  x: 'clientTop',
  y: 'clientLeft'
};

/**
 * @constant {Object} INNER_SIZE_KEYS
 */
export const INNER_SIZE_KEYS = {
  x: 'innerWidth',
  y: 'innerHeight'
};

/**
 * @constant {number} MAX_CACHE_SIZE
 */
export const MAX_CACHE_SIZE = 250;

/**
 * @constant {Object} OFFSET_SIZE_KEYS
 */
export const OFFSET_SIZE_KEYS = {
  x: 'offsetWidth',
  y: 'offsetHeight'
};

/**
 * @constant {Object} OFFSET_START_KEYS
 */
export const OFFSET_START_KEYS = {
  x: 'offsetLeft',
  y: 'offsetTop'
};

/**
 * @constant {Object} OVERFLOW_KEYS
 */
export const OVERFLOW_KEYS = {
  x: 'overflowX',
  y: 'overflowY'
};

/**
 * @constant {Array<string>} OVERFLOW_VALUES
 */
export const OVERFLOW_VALUES = ['auto', 'scroll', 'overlay'];

/**
 * @constant {Object} SCROLL_SIZE_KEYS
 */
export const SCROLL_SIZE_KEYS = {
  x: 'scrollWidth',
  y: 'scrollHeight'
};

/**
 * @constant {Object} SCROLL_START_KEYS
 */
export const SCROLL_START_KEYS = {
  x: 'scrollLeft',
  y: 'scrollTop'
};

/**
 * @constant {Object} SIZE_KEYS
 */
export const SIZE_KEYS = {
  x: 'width',
  y: 'height'
};

/**
 * @constant {string} UNSTABLE_MESSAGE
 * @default
 */
export const UNSTABLE_MESSAGE = 'WindowedList failed to reach a stable state.';

/**
 * @constant {number} MAX_SYNC_UPDATES
 * @default
 */
export const MAX_SYNC_UPDATES = 100;

/**
 * @constant {Object} VALID_AXES
 */
export const VALID_AXES = {
  X: 'x',
  Y: 'y'
};

/**
 * @constant {Array<string>} VALID_AXIS_VALUES
 */
export const VALID_AXIS_VALUES = Object.keys(VALID_AXES).map((key) => {
  return VALID_AXES[key];
});

/**
 * @constant {Object} VALID_TYPES
 */
export const VALID_TYPES = {
  SIMPLE: 'simple',
  UNIFORM: 'uniform',
  VARIABLE: 'variable'
};

/**
 * @constant {Array<string>} VALID_TYPE_VALUES
 */
export const VALID_TYPE_VALUES = Object.keys(VALID_TYPES).map((key) => {
  return VALID_TYPES[key];
});

/**
 * @constant {string} DEFAULT_AXIS
 * @default
 */
export const DEFAULT_AXIS = VALID_AXES.Y;

/**
 * @constant {Object} OUTER_CONTAINER_STYLE
 */
export const OUTER_CONTAINER_STYLE = {
  height: '100%',
  maxHeight: 'inherit',
  width: '100%'
};

/**
 * @constant {Object} DEFAULT_CONTAINER_STYLE
 */
export const DEFAULT_CONTAINER_STYLE = {
  position: 'relative'
};

/**
 * @constant {Array<string>} REMEASURE_OPTIONS
 */
export const REMEASURE_OPTIONS = {
  inheritedMethods: ['getVisibleRange', 'scrollAround', 'scrollTo']
};

/**
 * @constant {Array<string>} REMEASURE_PROPERTIES
 */
export const REMEASURE_PROPERTIES = ['height', 'width'];
