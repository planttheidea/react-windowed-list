// external dependencies
import PropTypes from 'prop-types';
import React, {
  PureComponent
} from 'react';
import measure from 'remeasure';

// constants
import {
  DEFAULT_AXIS,
  DEFAULT_LENGTH,
  DEFAULT_MIN_SIZE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_THRESHOLD,
  DEFAULT_TYPE,
  DEFAULT_USE_POSITION,
  DEFAULT_USE_STATIC_SIZE,
  DEFAULT_USE_TRANSLATE_3D,
  OUTER_CONTAINER_STYLE,
  REMEASURE_OPTIONS,
  REMEASURE_PROPERTIES,
  VALID_AXIS_VALUES,
  VALID_TYPES,
  VALID_TYPE_VALUES
} from './constants';

// instance methods
import {
  createGetItemSizeAndItemsPerRow,
  createGetScrollOffset,
  createGetScrollParent,
  createGetSizeOfListItem,
  createGetSpaceBefore,
  createGetStartAndEnd,
  createGetVisibleRange,
  createRenderItems,
  createScrollAround,
  createScrollTo,
  createSetReconcileFrameAfterUpdate,
  createSetScroll,
  createSetStateIfAppropriate,
  createUpdateFrame,
  createUpdateScrollParent,
  createUpdateSimpleFrame,
  createUpdateUniformFrame,
  createUpdateVariableFrame
} from './instanceMethods';

// lifecycle methods
import {
  createComponentDidMount,
  createComponentDidUpdate,
  createComponentWillMount,
  createComponentWillReceiveProps,
  createComponentWillUnmount,
  getInitialState
} from './lifecycleMethods';

// utils
import {
  getContainerStyle,
  defaultItemRenderer,
  defaultContainerRenderer,
  getListContainerStyle
} from './utils';

@measure(REMEASURE_PROPERTIES, REMEASURE_OPTIONS)
class WindowedList extends PureComponent {
  static propTypes = {
    axis: PropTypes.oneOf(VALID_AXIS_VALUES).isRequired,
    containerRenderer: PropTypes.func.isRequired,
    debounceReconciler: PropTypes.number,
    initialIndex: PropTypes.number,
    isHidden: PropTypes.bool.isRequired,
    isLazy: PropTypes.bool.isRequired,
    itemRenderer: PropTypes.func.isRequired,
    itemSizeEstimator: PropTypes.func,
    itemSizeGetter: PropTypes.func,
    length: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    scrollParentGetter: PropTypes.func,
    threshold: PropTypes.number.isRequired,
    type: PropTypes.oneOf(VALID_TYPE_VALUES).isRequired,
    usePosition: PropTypes.bool.isRequired,
    useStaticSize: PropTypes.bool.isRequired,
    useTranslate3d: PropTypes.bool.isRequired
  };

  static defaultProps = {
    axis: DEFAULT_AXIS,
    containerRenderer: defaultContainerRenderer,
    isHidden: false,
    isLazy: false,
    itemRenderer: defaultItemRenderer,
    length: DEFAULT_LENGTH,
    minSize: DEFAULT_MIN_SIZE,
    pageSize: DEFAULT_PAGE_SIZE,
    threshold: DEFAULT_THRESHOLD,
    type: DEFAULT_TYPE,
    usePosition: DEFAULT_USE_POSITION,
    useStaticSize: DEFAULT_USE_STATIC_SIZE,
    useTranslate3d: DEFAULT_USE_TRANSLATE_3D
  };

  // initial state
  state = getInitialState();

  // lifecycle methods
  componentWillMount = createComponentWillMount(this);
  componentDidMount = createComponentDidMount(this);
  componentWillReceiveProps = createComponentWillReceiveProps(this);
  componentDidUpdate = createComponentDidUpdate(this);
  componentWillUnmount = createComponentWillUnmount(this);

  // instance values
  cache = {};
  outerContainer = null;
  prevPrevState = {};
  reconcileFrameAfterUpdate = null;
  unstable = false;
  updateCounter = 0;

  // instance methods
  getItemSizeAndItemsPerRow = createGetItemSizeAndItemsPerRow(this);
  getScrollOffset = createGetScrollOffset(this);
  getScrollParent = createGetScrollParent(this);
  getSizeOfListItem = createGetSizeOfListItem(this);
  getSpaceBefore = createGetSpaceBefore(this);
  getStartAndEnd = createGetStartAndEnd(this);
  getVisibleRange = createGetVisibleRange(this);
  renderItems = createRenderItems(this);
  scrollAround = createScrollAround(this);
  scrollTo = createScrollTo(this);
  setReconcileFrameAfterUpdate = createSetReconcileFrameAfterUpdate(this);
  setScroll = createSetScroll(this);
  setStateIfAppropriate = createSetStateIfAppropriate(this);
  updateFrame = createUpdateFrame(this);
  updateScrollParent = createUpdateScrollParent(this);
  updateSimpleFrame = createUpdateSimpleFrame(this);
  updateUniformFrame = createUpdateUniformFrame(this);
  updateVariableFrame = createUpdateVariableFrame(this);

  render() {
    const {
      type
    } = this.props;

    const items = this.renderItems();

    if (type === VALID_TYPES.SIMPLE) {
      return items;
    }

    const style = getContainerStyle(this.props, this.state, this.getSpaceBefore);
    const listStyle = getListContainerStyle(this.props, this.state, this.getSpaceBefore);

    return (
      <div style={OUTER_CONTAINER_STYLE}>
        <div style={style}>
          <div style={listStyle}>
            {items}
          </div>
        </div>
      </div>
    );
  }
}

WindowedList.displayName = 'WindowedList';

export default WindowedList;
