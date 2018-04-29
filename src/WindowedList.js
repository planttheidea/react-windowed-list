// external dependencies
import React from 'react';
import {createComponent, createComponentRef} from 'react-parm';

// classes
import WindowedListRenderer from './WindowedListRenderer';

/**
 * @function getVisibleRange
 *
 * @description
 * get the visible range on the windowed list component
 *
 * @param {ReactComponent} ref the WindowedList component
 * @returns {Array<number>}
 */
export const getVisibleRange = ({ref}) =>
  ref && ref.originalComponent ? ref.originalComponent.getVisibleRange() : [0, 0];

/**
 * @function scrollAround
 *
 * @description
 * scroll around the index passed on the windowed list component
 *
 * @param {ReactComponent} ref the WindowedList component
 * @param {number} index the index to scroll around
 * @returns {Array<number>}
 */
export const scrollAround = ({ref}, [index]) =>
  ref && ref.originalComponent ? ref.originalComponent.scrollAround(index) : null;

/**
 * @function scrollTo
 *
 * @description
 * scroll to the index passed on the windowed list component
 *
 * @param {ReactComponent} ref the WindowedList component
 * @param {number} index the index to scroll to
 * @returns {Array<number>}
 */
export const scrollTo = ({ref}, [index]) =>
  ref && ref.originalComponent ? ref.originalComponent.scrollTo(index) : null;

const WindowedList = (props, instance) => (
  /* eslint-disable prettier */
  <WindowedListRenderer
    {...props}
    ref={createComponentRef(instance, 'ref')}
  />
  /* eslint-enable */
);

WindowedList.displayName = 'WindowedList';

export default createComponent(WindowedList, {
  // instance values
  ref: null,
  // instance methods
  getVisibleRange,
  scrollAround,
  scrollTo
});
