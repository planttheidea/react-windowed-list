// external dependencies
import noop from 'lodash/noop';
import raf from 'raf';

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

export const createComponentDidMount = (instance) => {
  /**
   * @function componentDidMount
   *
   * @description
   * on mount, update the frame with the desired scroll position
   */
  return () => {
    raf(() => {
      instance.updateFrame(instance.scrollTo());
    });
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

    raf(() => {
      instance.updateFrame();
    });
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
      from,
      itemsPerRow,
      size
    } = instance.state;

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
    instance.scrollParent.removeEventListener('scroll', instance.updateFrame, ADD_EVENT_LISTENER_OPTIONS);
    instance.scrollParent.removeEventListener('mousewheel', noop, ADD_EVENT_LISTENER_OPTIONS);
  };
};
