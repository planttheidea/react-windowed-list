// external dependencies
import PropTypes from 'prop-types';
import React from 'react';
import {createComponent} from 'react-parm';
import {measure} from 'remeasure';

// constants
import {
  HAS_NEW_LIFECYCLE_METHODS,
  OUTER_CONTAINER_STYLE,
  VALID_AXES,
  VALID_AXIS_VALUES,
  VALID_TYPES,
  VALID_TYPE_VALUES
} from './constants';

// instance methods
import {
  getItemSizeAndItemsPerRow,
  getScrollOffset,
  getScrollParent,
  getSizeOfListItem,
  getSpaceBefore,
  getStartAndEnd,
  getVisibleRange,
  renderItems,
  scrollAround,
  scrollTo,
  setReconcileFrameAfterUpdate,
  setScroll,
  setStateIfAppropriate,
  updateFrame,
  updateScrollParent,
  updateSimpleFrame,
  updateUniformFrame,
  updateVariableFrame
} from './instanceMethods';

// lifecycle methods
import {
  onConstruct,
  componentDidMount,
  getDerivedStateFromProps,
  componentWillReceiveProps,
  getSnapshotBeforeUpdate,
  componentDidUpdate,
  componentWillUnmount
} from './lifecycleMethods';

// utils
import {DefaultItemRenderer, DefaultContainerRenderer, getInnerContainerStyle, getListContainerStyle} from './utils';

export const DEFAULT_PARM_OPTIONS = {
  // state
  state: {
    from: 0,
    itemsPerRow: 0,
    size: 0
  },
  // lifecycle methods
  onConstruct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
  // instance values
  cache: {},
  outerContainer: null,
  reconcileFrameAfterUpdate: null,
  unstableTimeoutId: null,
  updateCounter: 0,
  updateCounterTimeoutId: null,
  // instance methods
  getItemSizeAndItemsPerRow,
  getScrollOffset,
  getScrollParent,
  getSizeOfListItem,
  getSpaceBefore,
  getStartAndEnd,
  getVisibleRange,
  renderItems,
  scrollAround,
  scrollTo,
  setReconcileFrameAfterUpdate,
  setScroll,
  setStateIfAppropriate,
  updateFrame,
  updateScrollParent,
  updateSimpleFrame,
  updateUniformFrame,
  updateVariableFrame
};

export const PARM_OPTIONS = HAS_NEW_LIFECYCLE_METHODS
  ? {
    ...DEFAULT_PARM_OPTIONS,
    getSnapshotBeforeUpdate
  }
  : {
    ...DEFAULT_PARM_OPTIONS,
    componentWillReceiveProps
  };

export const WindowedListRenderer = createComponent(
  ({axis, length, type, usePosition, useTranslate3d}, {getSpaceBefore, renderItems, state: {from, itemsPerRow}}) =>
    type === VALID_TYPES.SIMPLE ? (
      renderItems()
    ) : (
      <div style={OUTER_CONTAINER_STYLE}>
        <div style={getInnerContainerStyle(axis, length, itemsPerRow, getSpaceBefore)}>
          <div style={getListContainerStyle(axis, usePosition, useTranslate3d, from, getSpaceBefore)}>
            {renderItems()}
          </div>
        </div>
      </div>
    ),
  PARM_OPTIONS
);

WindowedListRenderer.displayName = 'WindowedListRenderer';

WindowedListRenderer.propTypes = {
  axis: PropTypes.oneOf(VALID_AXIS_VALUES).isRequired,
  containerRenderer: PropTypes.func.isRequired,
  debounceReconciler: PropTypes.number,
  getEstimatedItemSize: PropTypes.func,
  getItemSize: PropTypes.func,
  getScrollParent: PropTypes.func,
  initialIndex: PropTypes.number.isRequired,
  isHidden: PropTypes.bool.isRequired,
  isLazy: PropTypes.bool.isRequired,
  itemRenderer: PropTypes.func.isRequired,
  length: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  threshold: PropTypes.number.isRequired,
  type: PropTypes.oneOf(VALID_TYPE_VALUES).isRequired,
  usePosition: PropTypes.bool.isRequired,
  useStaticSize: PropTypes.bool.isRequired,
  useTranslate3d: PropTypes.bool.isRequired
};

WindowedListRenderer.defaultProps = {
  axis: VALID_AXES.Y,
  containerRenderer: DefaultContainerRenderer,
  initialIndex: 0,
  isHidden: false,
  isLazy: false,
  itemRenderer: DefaultItemRenderer,
  length: 0,
  minSize: 1,
  pageSize: 10,
  threshold: 100,
  type: VALID_TYPES.SIMPLE,
  usePosition: false,
  useStaticSize: false,
  useTranslate3d: false
};

if (HAS_NEW_LIFECYCLE_METHODS) {
  WindowedListRenderer.getDerivedStateFromProps = getDerivedStateFromProps;
}

export default measure(['height', 'width'], {namespace: '__windowedListMeasurements'})(WindowedListRenderer);
