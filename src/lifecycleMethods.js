// external dependencies
import noop from 'lodash/noop';
import raf from 'raf';
import {
  findDOMNode
} from 'react-dom';

// constants
import {
  MAX_SYNC_UPDATES,
  ADD_EVENT_LISTENER_OPTIONS,
  UNSTABLE_MESSAGE
} from './constants';

// utils
import {
  getFromAndSize
} from './utils';

/**
 * @function getInitialState
 *
 * @description
 * get the initial state of the instance
 *
 * @returns {{from: number, itemsPerRow: number, size: number}} the initial state
 */
export const getInitialState = () => {
  return {
    from: 0,
    itemsPerRow: 0,
    size: 0
  };
};

export const createComponentDidMount = (instance) => {
  /**
   * @function componentDidMount
   *
   * @description
   * on mount, update the frame with the desired scroll position
   */
  return () => {
    instance.outerContainer = findDOMNode(instance);

    if (!instance.props.isHidden) {
      raf(() => {
        instance.updateFrame(instance.scrollTo);
      });
    }
  };
};

export const createComponentDidUpdate = (instance) => {
  /**
   * @function componentDidUpdate
   *
   * @description
   * update the frame position, cutting off after a certain point if unstable
   *
   * @returns {void}
   */
  return () => {
    if (instance.unstable) {
      return;
    }

    if (++instance.updateCounter > MAX_SYNC_UPDATES) {
      instance.unstable = true;

      /* eslint-disable no-console */
      return console.error(UNSTABLE_MESSAGE);
      /* eslint-enable */
    }

    if (!instance.updateCounterTimeoutId) {
      instance.updateCounterTimeoutId = raf(() => {
        instance.updateCounter = 0;

        delete instance.updateCounterTimeoutId;
      });
    }

    if (!instance.props.isHidden) {
      instance.reconcileFrameAfterUpdate(instance.updateFrame);
    }
  };
};

export const createComponentWillMount = (instance) => {
  /**
   * @function componentWillMount
   *
   * @description
   * prior to mount, set the initial state
   */
  return () => {
    const {
      initialIndex
    } = instance.props;
    const itemsPerRow = 1;
    const fromAndSize = getFromAndSize(initialIndex, 0, itemsPerRow, instance.props);

    instance.setReconcileFrameAfterUpdate();

    instance.setState({
      ...fromAndSize,
      itemsPerRow
    });
  };
};

export const createComponentWillReceiveProps = (instance) => {
  /**
   * @function componentWillReceiveProps
   *
   * @description
   * when props are received, set the state if the next calculated state is different
   *
   * @param {Object} nextProps the incoming props
   */
  return (nextProps) => {
    const {
      debounceReconciler
    } = instance.props;
    const {
      from,
      itemsPerRow,
      size
    } = instance.state;

    if (nextProps.debounceReconciler !== debounceReconciler) {
      instance.setReconcileFrameAfterUpdate();
    }

    instance.setStateIfAppropriate(getFromAndSize(from, size, itemsPerRow, nextProps), noop);
  };
};

export const createComponentWillUnmount = (instance) => {
  /**
   * @function componentWillUnmount
   *
   * @description
   * before unmount, remove any listeners applied to the scroll container
   */
  return () => {
    if (instance.scrollParent) {
      instance.scrollParent.removeEventListener('scroll', instance.updateFrame, ADD_EVENT_LISTENER_OPTIONS);
      instance.scrollParent.removeEventListener('mousewheel', noop, ADD_EVENT_LISTENER_OPTIONS);
    }

    instance.outerContainer = null;
  };
};
