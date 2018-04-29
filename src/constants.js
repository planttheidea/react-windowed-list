// external dependencies
import React from 'react';

/**
 * @constant {boolean} ADD_EVENT_LISTENER_OPTIONS
 * @default
 */
export const ADD_EVENT_LISTENER_OPTIONS = (() => {
  if (typeof window === 'undefined') {
    return false;
  }

  let hasSupport = false;

  try {
    document.createElement('div').addEventListener('test', () => {}, {
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
  ? {
    passive: true
  }
  : false;

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
export const VALID_AXIS_VALUES = Object.keys(VALID_AXES).map((key) => VALID_AXES[key]);

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
export const VALID_TYPE_VALUES = Object.keys(VALID_TYPES).map((key) => VALID_TYPES[key]);

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
 * @constant {number} UNSTABLE_TIMEOUT
 */
export const UNSTABLE_TIMEOUT = 250;

/**
 * @constant {number} REACT_MINOR_VERSION
 */
export const REACT_MINOR_VERSION = +React.version
  .split('.')
  .slice(0, 2)
  .join('.');

/**
 * @constant {boolean} HAS_NEW_LIFECYCLE_METHODS
 */
export const HAS_NEW_LIFECYCLE_METHODS = REACT_MINOR_VERSION >= 16.3;
