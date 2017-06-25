// external dependencies
import PropTypes from 'prop-types';
import React, {
  PureComponent
} from 'react';
import measure from 'remeasure';

// constants
import {
  OUTER_CONTAINER_STYLE,
  REMEASURE_OPTIONS,
  REMEASURE_PROPERTIES,
  VALID_AXES,
  VALID_AXIS_VALUES,
  VALID_TYPES,
  VALID_TYPE_VALUES
} from './constants';

// instance methods
import {
  createGetContainerStyle,
  createGetItemSizeAndItemsPerRow,
  createGetListContainerStyle,
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
  defaultItemRenderer,
  defaultContainerRenderer
} from './utils';

@measure(REMEASURE_PROPERTIES, REMEASURE_OPTIONS)
class WindowedList extends PureComponent {
  static propTypes = {
    axis: PropTypes.oneOf(VALID_AXIS_VALUES).isRequired,
    containerRenderer: PropTypes.func.isRequired,
    debounceReconciler: PropTypes.number,
    initialIndex: PropTypes.number.isRequired,
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
    axis: VALID_AXES.Y,
    containerRenderer: defaultContainerRenderer,
    initialIndex: 0,
    isHidden: false,
    isLazy: false,
    itemRenderer: defaultItemRenderer,
    length: 0,
    minSize: 1,
    pageSize: 10,
    threshold: 100,
    type: VALID_TYPES.SIMPLE,
    usePosition: false,
    useStaticSize: false,
    useTranslate3d: false
  };

  // initial state
  state = getInitialState(this);

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
  getContainerStyle = createGetContainerStyle(this);
  getItemSizeAndItemsPerRow = createGetItemSizeAndItemsPerRow(this);
  getListContainerStyle = createGetListContainerStyle(this);
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
    const items = this.renderItems();

    if (this.props.type === VALID_TYPES.SIMPLE) {
      return items;
    }

    const style = this.getContainerStyle();
    const listStyle = this.getListContainerStyle();

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
