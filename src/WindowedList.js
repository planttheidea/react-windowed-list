// external dependencies
import React, {Component} from 'react';

// classes
import WindowedListRenderer from './WindowedListRenderer';

export const createGetVisibleRange = (instance) => {
  /**
   * @function getVisibleRange
   *
   * @description
   * get the visible range on the windowed list component
   *
   * @returns {Array<number>}
   */
  return () => {
    if (!instance.ref || !instance.ref.originalComponent) {
      return [0, 0];
    }

    return instance.ref.originalComponent.getVisibleRange();
  };
};

export const createScrollAround = (instance) => {
  /**
   * @function scrollAround
   *
   * @description
   * scroll around the index passed on the windowed list component
   *
   * @param {number} index the index to scroll around
   * @returns {Array<number>}
   */
  return (index) => {
    if (!instance.ref || !instance.ref.originalComponent) {
      return;
    }

    return instance.ref.originalComponent.scrollAround(index);
  };
};

export const createScrollTo = (instance) => {
  /**
   * @function scrollTo
   *
   * @description
   * scroll to the index passed on the windowed list component
   *
   * @param {number} index the index to scroll to
   * @returns {Array<number>}
   */
  return (index) => {
    if (!instance.ref || !instance.ref.originalComponent) {
      return;
    }

    return instance.ref.originalComponent.scrollTo(index);
  };
};

export const createSetRef = (instance) => {
  /**
   * @function setRef
   *
   * @description
   * set the ref of the original instance
   *
   * @param {ReactComponent} component the WindowedListRenderer component
   */
  return (component) => {
    instance.ref = component;
  };
};

class WindowedList extends Component {
  static displayName = 'WindowedList';

  // instance values
  ref = null;

  // instance methods
  getVisibleRange = createGetVisibleRange(this);
  scrollAround = createScrollAround(this);
  scrollTo = createScrollTo(this);
  setRef = createSetRef(this);

  render() {
    return (
      /* eslint-disable prettier */
      <WindowedListRenderer
        {...this.props}
        ref={this.setRef}
      />
      /* eslint-enable */
    );
  }
}

export default WindowedList;
