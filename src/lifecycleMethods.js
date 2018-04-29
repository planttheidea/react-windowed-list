// external dependencies
import raf from 'raf';
import {findDOMNode} from 'react-dom';

// constants
import {MAX_SYNC_UPDATES, ADD_EVENT_LISTENER_OPTIONS, UNSTABLE_MESSAGE, UNSTABLE_TIMEOUT} from './constants';

// utils
import {getFromAndSize, noop} from './utils';

/**
 * @function onConstruct
 *
 * @description
 * on construction, set the initial state
 *
 * @param {ReactComponent} instance the component instance
 */
export const onConstruct = (instance) => {
  const {props, setReconcileFrameAfterUpdate, state} = instance;

  const itemsPerRow = 1;

  setReconcileFrameAfterUpdate();

  instance.state = {
    ...state,
    ...getFromAndSize(props.initialIndex, 0, itemsPerRow, props),
    itemsPerRow
  };
};

/**
 * @function componentDidMount
 *
 * @description
 * on mount, update the frame with the desired scroll position
 *
 * @param {ReactComponent} instance the component instance
 */
export const componentDidMount = (instance) => {
  instance.outerContainer = findDOMNode(instance);

  if (!instance.props.isHidden) {
    raf(() => instance.updateFrame(instance.scrollTo));
  }
};

/**
 * @function getDerivedStateFromProps
 *
 * @description
 * get the next state based on the next props
 *
 * @param {Object} nextProps the next props passed
 * @param {number} from the first index to render
 * @param {number} itemsPerRow the number of items per row
 * @param {number} size the number of items to render
 * @returns {Object|null} the next state, if applicable
 */
export const getDerivedStateFromProps = (nextProps, {from, itemsPerRow, size}) => {
  const fromAndSize = getFromAndSize(from, size, itemsPerRow, nextProps);

  return fromAndSize.from === from && fromAndSize.size === size ? null : fromAndSize;
};

/**
 * @function componentWillReceiveProps
 *
 * @description
 * when props are received, set the state if the next calculated state is different
 *
 * @param {number} debounceReconciler the debounce reconciler in props
 * @param {function} setReconcileFrameAfterUpdate the method to set the reconciler frame
 * @param {function} setStateIfAppropriate the method to set the state if changed
 * @param {number} from the first index to render
 * @param {number} itemsPerRow the number of items per row
 * @param {number} size the number of items to render
 * @param {Object} nextProps the incoming props
 */
export const componentWillReceiveProps = (
  {props: {debounceReconciler}, setReconcileFrameAfterUpdate, setStateIfAppropriate, state: {from, itemsPerRow, size}},
  [nextProps]
) => {
  if (debounceReconciler !== nextProps.debounceReconciler) {
    setReconcileFrameAfterUpdate();
  }

  setStateIfAppropriate(getFromAndSize(from, size, itemsPerRow, nextProps), noop);
};

/**
 * @function getSnapshotBeforeUpdate
 *
 * @description
 * update the debounce reconciler if the values have changed in props
 *
 * @param {number} debounceReconciler the delay to wait before reconciling in props
 * @param {function} setReconcileFrameAfterUpdate the method to set the reconciler frame
 * @param {Object} previousProps the previous props values
 * @returns {void}
 */
export const getSnapshotBeforeUpdate = ({props: {debounceReconciler}, setReconcileFrameAfterUpdate}, [previousProps]) =>
  debounceReconciler !== previousProps.debounceReconciler && setReconcileFrameAfterUpdate();

/**
 * @function componentDidUpdate
 *
 * @description
 * update the frame position, cutting off after a certain point if unstable
 *
 * @param {ReactComponent} instance the component instance
 * @returns {void}
 */
export const componentDidUpdate = (instance) => {
  if (instance.unstableTimeoutId || ++instance.updateCounter > MAX_SYNC_UPDATES) {
    clearTimeout(instance.unstableTimeoutId);

    if (!instance.unstableTimeoutId) {
      console.error(UNSTABLE_MESSAGE); // eslint-disable-line no-console
    }

    instance.unstableTimeoutId = setTimeout(() => {
      instance.unstableTimeoutId = null;
      instance.updateCounter = 0;
    }, UNSTABLE_TIMEOUT);

    return;
  }

  if (!instance.updateCounterTimeoutId) {
    instance.updateCounterTimeoutId = raf(() => {
      instance.updateCounter = 0;
      instance.updateCounterTimeoutId = null;
    });
  }

  if (!instance.props.isHidden) {
    instance.reconcileFrameAfterUpdate(instance.updateFrame);
  }
};

/**
 * @function componentWillUnmount
 *
 * @description
 * before unmount, remove any listeners applied to the scroll container
 *
 * @param {ReactComponent} instance the component instance
 */
export const componentWillUnmount = (instance) => {
  if (instance.scrollParent) {
    instance.scrollParent.removeEventListener('scroll', instance.updateFrame, ADD_EVENT_LISTENER_OPTIONS);
    instance.scrollParent.removeEventListener('mousewheel', noop, ADD_EVENT_LISTENER_OPTIONS);
  }

  instance.outerContainer = null;
};
