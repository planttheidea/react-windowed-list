// test
import test from 'ava';
import _ from 'lodash';
import noop from 'lodash/noop';
import raf from 'raf';
import sinon from 'sinon';

// src
import * as methods from 'src/instanceMethods';
import * as constants from 'src/constants';
import * as utils from 'src/utils';

test('if createGetItemSizeAndItemsPerRow will return itemSize and itemsPerRow if they exist and useStaticSize is true', (t) => {
  const instance = {
    props: {
      axis: 'y',
      useStaticSize: true
    },
    state: {
      itemSize: 30,
      itemsPerRow: 1
    }
  };

  const getItemSizeAndItemsPerRow = methods.createGetItemSizeAndItemsPerRow(instance);

  t.true(_.isFunction(getItemSizeAndItemsPerRow));

  const fakeItemSizeAndItemsPerRow = {
    itemSize: 40,
    itemsPerRow: 2
  };

  const getCalculatedItemSizeAndItemsPerRowStub = sinon.stub(utils, 'getCalculatedItemSizeAndItemsPerRow').returns(fakeItemSizeAndItemsPerRow);

  const result = getItemSizeAndItemsPerRow();

  t.true(getCalculatedItemSizeAndItemsPerRowStub.notCalled);

  getCalculatedItemSizeAndItemsPerRowStub.restore();

  t.deepEqual(result, {
    itemSize: instance.state.itemSize,
    itemsPerRow: 1
  });
});

test('if createGetItemSizeAndItemsPerRow will return an empty object if useStaticSize is false and there are no children', (t) => {
  const instance = {
    props: {
      axis: 'y',
      useStaticSize: false
    },
    state: {
      itemSize: 30,
      itemsPerRow: 1
    }
  };

  const getItemSizeAndItemsPerRow = methods.createGetItemSizeAndItemsPerRow(instance);

  t.true(_.isFunction(getItemSizeAndItemsPerRow));

  const fakeItemSizeAndItemsPerRow = {
    itemSize: 40,
    itemsPerRow: 2
  };

  const getCalculatedItemSizeAndItemsPerRowStub = sinon.stub(utils, 'getCalculatedItemSizeAndItemsPerRow').returns(fakeItemSizeAndItemsPerRow);

  const result = getItemSizeAndItemsPerRow();

  t.true(getCalculatedItemSizeAndItemsPerRowStub.notCalled);

  getCalculatedItemSizeAndItemsPerRowStub.restore();

  t.deepEqual(result, {});
});

test('if createGetItemSizeAndItemsPerRow will return the object from getCalculatedItemSizeAndItemsPerRow ' +
  'if useStaticSize is false and there are children', (t) => {
  const instance = {
    items: {
      children: [
        'foo'
      ]
    },
    props: {
      axis: 'y',
      useStaticSize: false
    },
    state: {
      itemSize: 30,
      itemsPerRow: 1
    }
  };

  const getItemSizeAndItemsPerRow = methods.createGetItemSizeAndItemsPerRow(instance);

  t.true(_.isFunction(getItemSizeAndItemsPerRow));

  const fakeItemSizeAndItemsPerRow = {
    itemSize: 40,
    itemsPerRow: 2
  };

  const getCalculatedItemSizeAndItemsPerRowStub = sinon.stub(utils, 'getCalculatedItemSizeAndItemsPerRow').returns(fakeItemSizeAndItemsPerRow);

  const result = getItemSizeAndItemsPerRow();

  t.true(getCalculatedItemSizeAndItemsPerRowStub.calledOnce);
  t.true(getCalculatedItemSizeAndItemsPerRowStub.calledWith(instance.items.children, instance.props.axis,
    instance.state.itemSize));

  getCalculatedItemSizeAndItemsPerRowStub.restore();

  t.is(result, fakeItemSizeAndItemsPerRow);
});

test('if createGetScrollOffset will get the offset of the scrollParent when it is not the window', (t) => {
  const instance = {
    outerContainer: {},
    props: {
      axis: 'y'
    },
    scrollParent: {}
  };

  const getScrollOffset = methods.createGetScrollOffset(instance);

  t.true(_.isFunction(getScrollOffset));

  const getOffsetStub = sinon.stub(utils, 'getOffset').returns(50);
  const getScrollSizeStub = sinon.stub(utils, 'getScrollSize').returns(100);
  const getViewportSizeStub = sinon.stub(utils, 'getViewportSize').returns(10);

  getScrollOffset();

  t.true(getScrollSizeStub.calledOnce);
  t.true(getScrollSizeStub.calledWith(instance.scrollParent, instance.props.axis));

  getScrollSizeStub.restore();

  t.true(getViewportSizeStub.calledOnce);
  t.true(getViewportSizeStub.calledWith(instance.scrollParent, instance.props.axis));

  getViewportSizeStub.restore();

  t.true(getOffsetStub.calledTwice);

  const firstArgs = getOffsetStub.firstCall.args;

  t.deepEqual([...firstArgs], [
    instance.scrollParent,
    instance.props.axis
  ]);

  const secondArgs = getOffsetStub.secondCall.args;

  t.deepEqual([...secondArgs], [
    instance.outerContainer,
    instance.props.axis
  ]);

  getOffsetStub.restore();
});

test('if createGetScrollOffset will get the offset of the scrollParent when it is the window', (t) => {
  const instance = {
    outerContainer: {},
    props: {
      axis: 'y'
    },
    scrollParent: window
  };

  const getScrollOffset = methods.createGetScrollOffset(instance);

  t.true(_.isFunction(getScrollOffset));

  const getOffsetStub = sinon.stub(utils, 'getOffset').returns(50);
  const getScrollSizeStub = sinon.stub(utils, 'getScrollSize').returns(100);
  const getViewportSizeStub = sinon.stub(utils, 'getViewportSize').returns(10);

  getScrollOffset();

  t.true(getScrollSizeStub.calledOnce);
  t.true(getScrollSizeStub.calledWith(instance.scrollParent, instance.props.axis));

  getScrollSizeStub.restore();

  t.true(getViewportSizeStub.calledOnce);
  t.true(getViewportSizeStub.calledWith(instance.scrollParent, instance.props.axis));

  getViewportSizeStub.restore();

  t.true(getOffsetStub.calledTwice);

  const firstArgs = getOffsetStub.firstCall.args;

  t.deepEqual([...firstArgs], [
    instance.scrollParent,
    instance.props.axis
  ]);

  const secondArgs = getOffsetStub.secondCall.args;

  t.deepEqual([...secondArgs], [
    instance.outerContainer,
    instance.props.axis
  ]);

  getOffsetStub.restore();
});

test('if createGetScrollParent will return immediately if there is a scrollParentGetter', (t) => {
  const element = {
    parentElement: {}
  };
  const scrollGetterElement = {};
  const instance = {
    getDomNode: sinon.stub().returns(element),
    props: {
      axis: 'y',
      scrollParentGetter: sinon.stub().returns(scrollGetterElement)
    }
  };

  const getScrollParent = methods.createGetScrollParent(instance);

  t.true(_.isFunction(getScrollParent));

  const getComputedStyleStub = sinon.stub(window, 'getComputedStyle').returns({});

  const result = getScrollParent();

  t.true(instance.props.scrollParentGetter.calledOnce);

  t.true(getComputedStyleStub.notCalled);

  getComputedStyleStub.restore();

  t.is(result, scrollGetterElement);
});

test.skip('if createGetScrollParent will return the window if the overflowStyleKey is not found on the element', (t) => {
  const element = {};
  const scrollGetterElement = {};
  const instance = {
    getDomNode: sinon.stub().returns(element),
    props: {
      axis: 'y',
      scrollParentGetter: null
    }
  };

  const getScrollParent = methods.createGetScrollParent(instance);

  t.true(_.isFunction(getScrollParent));

  const getComputedStyleStub = sinon.stub(window, 'getComputedStyle').returns({});

  const result = getScrollParent();

  t.true(getComputedStyleStub.notCalled);

  getComputedStyleStub.restore();

  t.is(result, scrollGetterElement);
});

test.skip('if createGetScrollParent will return the element if the overflowStyleKey is found on the element', (t) => {
  const axis = 'y';
  const element = {
    [constants.OVERFLOW_KEYS[axis]]: 'auto'
  };
  const scrollGetterElement = {};
  const instance = {
    getDomNode: sinon.stub().returns(element),
    props: {
      axis,
      scrollParentGetter: null
    }
  };

  const getScrollParent = methods.createGetScrollParent(instance);

  t.true(_.isFunction(getScrollParent));

  const getComputedStyleStub = sinon.stub(window, 'getComputedStyle').returns({});

  const result = getScrollParent();

  t.true(getComputedStyleStub.notCalled);

  getComputedStyleStub.restore();

  t.is(result, scrollGetterElement);
});

test('if createGetSizeOfListItem will return the itemSize if it exists', (t) => {
  const fakeDomNode = {
    children: []
  };
  const instance = {
    cache: {},
    getDomNode: sinon.stub().returns(fakeDomNode),
    props: {
      axis: 'y',
      itemSizeEstimator: sinon.spy(),
      itemSizeGetter: sinon.spy(),
      type: constants.VALID_TYPES.SIMPLE
    },
    state: {
      from: 0,
      itemSize: 30,
      size: 100
    }
  };

  const getSizeOfListItem = methods.createGetSizeOfListItem(instance);

  t.true(_.isFunction(getSizeOfListItem));

  const index = 0;

  const result = getSizeOfListItem(index);

  t.true(instance.props.itemSizeGetter.notCalled);

  t.true(instance.getDomNode.notCalled);

  t.true(instance.props.itemSizeEstimator.notCalled);

  t.is(result, instance.state.itemSize);
});

test('if createGetSizeOfListItem will call the itemSizeGetter if it exists', (t) => {
  const estimatedSize = 30;
  const fakeDomNode = {
    children: []
  };
  const gottenSize = 40;
  const instance = {
    cache: {},
    getDomNode: sinon.stub().returns(fakeDomNode),
    props: {
      axis: 'y',
      itemSizeEstimator: sinon.stub().returns(estimatedSize),
      itemSizeGetter: sinon.stub().returns(gottenSize),
      type: constants.VALID_TYPES.SIMPLE
    },
    state: {
      from: 0,
      size: 100
    }
  };

  const getSizeOfListItem = methods.createGetSizeOfListItem(instance);

  t.true(_.isFunction(getSizeOfListItem));

  const index = 0;

  const result = getSizeOfListItem(index);

  t.true(instance.props.itemSizeGetter.calledOnce);
  t.true(instance.props.itemSizeGetter.calledWith(index));

  t.true(instance.getDomNode.notCalled);

  t.true(instance.props.itemSizeEstimator.notCalled);

  t.is(result, gottenSize);
});

test('if createGetSizeOfListItem will pull from cache if the value exists', (t) => {
  const estimatedSize = 30;
  const fakeDomNode = {
    children: [
      {
        [constants.OFFSET_SIZE_KEYS.y]: 20
      }
    ]
  };
  const instance = {
    cache: {
      0: 40
    },
    getDomNode: sinon.stub().returns(fakeDomNode),
    items: [],
    props: {
      axis: 'y',
      itemSizeEstimator: sinon.stub().returns(estimatedSize),
      itemSizeGetter: null,
      type: constants.VALID_TYPES.SIMPLE
    },
    state: {
      from: 0,
      size: 100
    }
  };

  const getSizeOfListItem = methods.createGetSizeOfListItem(instance);

  t.true(_.isFunction(getSizeOfListItem));

  const index = 0;

  const result = getSizeOfListItem(index);

  t.true(instance.getDomNode.notCalled);

  t.true(instance.props.itemSizeEstimator.notCalled);

  t.is(result, instance.cache[0]);
});

test('if createGetSizeOfListItem will get the DOM node style key', (t) => {
  const estimatedSize = 30;
  const instance = {
    cache: {},
    items: {
      children: [
        {
          [constants.OFFSET_SIZE_KEYS.y]: 20
        }
      ]
    },
    props: {
      axis: 'y',
      itemSizeEstimator: sinon.stub().returns(estimatedSize),
      itemSizeGetter: null,
      type: constants.VALID_TYPES.VARIABLE
    },
    state: {
      from: 0,
      size: 100
    }
  };

  const getSizeOfListItem = methods.createGetSizeOfListItem(instance);

  t.true(_.isFunction(getSizeOfListItem));

  const index = 0;

  const result = getSizeOfListItem(index);

  t.true(instance.props.itemSizeEstimator.calledOnce);
  t.true(instance.props.itemSizeEstimator.calledWith(index, instance.cache));

  t.is(result, estimatedSize);
});

test('if createGetSizeOfListItem will return undefined if none of the techniques work', (t) => {
  const instance = {
    cache: {},
    items: {
      children: [
        {
          [constants.OFFSET_SIZE_KEYS.y]: 20
        }
      ]
    },
    props: {
      axis: 'y',
      itemSizeEstimator: null,
      itemSizeGetter: null,
      type: constants.VALID_TYPES.VARIABLE
    },
    state: {
      from: 0,
      size: 100
    }
  };

  const getSizeOfListItem = methods.createGetSizeOfListItem(instance);

  t.true(_.isFunction(getSizeOfListItem));

  const index = 0;

  const result = getSizeOfListItem(index);

  t.is(result, undefined);
});

test('if createGetSpaceBefore will return the item in cache if defined', (t) => {
  const instance = {
    state: {
      itemSize: 100,
      itemsPerRow: 1
    }
  };

  const getSpaceBefore = methods.createGetSpaceBefore(instance);

  t.true(_.isFunction(getSpaceBefore));

  const fakeResult = 'bar';

  const getCalculatedSpaceBeforeStub = sinon.stub(utils, 'getCalculatedSpaceBefore').returns(fakeResult);

  const index = 2;
  const cache = {
    2: 'foo'
  };

  const result = getSpaceBefore(index, cache);

  t.true(getCalculatedSpaceBeforeStub.notCalled);

  getCalculatedSpaceBeforeStub.restore();

  t.is(result, cache[2]);
});

test('if createGetSpaceBefore will not call getCalculatedSpaceBefore if there is an itemSize', (t) => {
  const instance = {
    state: {
      itemSize: 100,
      itemsPerRow: 1
    }
  };

  const getSpaceBefore = methods.createGetSpaceBefore(instance);

  t.true(_.isFunction(getSpaceBefore));

  const fakeResult = 'bar';

  const getCalculatedSpaceBeforeStub = sinon.stub(utils, 'getCalculatedSpaceBefore').returns(fakeResult);

  const index = 0;
  const cache = {};

  const result = getSpaceBefore(index, cache);

  t.true(getCalculatedSpaceBeforeStub.notCalled);

  getCalculatedSpaceBeforeStub.restore();

  t.is(result, 0);
});

test('if createGetSpaceBefore will call getCalculatedSpaceBefore if there is no itemSize', (t) => {
  const instance = {
    getSizeOfListItem() {},
    state: {
      itemSize: 0,
      itemsPerRow: 1
    }
  };

  const getSpaceBefore = methods.createGetSpaceBefore(instance);

  t.true(_.isFunction(getSpaceBefore));

  const fakeResult = 'bar';

  const getCalculatedSpaceBeforeStub = sinon.stub(utils, 'getCalculatedSpaceBefore').returns(fakeResult);

  const index = 0;
  const cache = {};

  const result = getSpaceBefore(index, cache);

  t.true(getCalculatedSpaceBeforeStub.calledOnce);
  t.true(getCalculatedSpaceBeforeStub.calledWith(cache, index, instance.getSizeOfListItem));

  getCalculatedSpaceBeforeStub.restore();

  t.is(result, fakeResult);
});

test('if createGetStartAndEnd will calculate start and end when hasDeterminateSize is false', (t) => {
  const instance = {
    getScrollOffset: sinon.stub().returns(0),
    getSpaceBefore: sinon.stub().returns(50),
    props: {
      axis: 'y',
      length: 100,
      threshold: 10,
      type: 'uniform'
    },
    scrollParent: {}
  };

  const getStartAndEnd = methods.createGetStartAndEnd(instance);

  t.true(_.isFunction(getStartAndEnd));

  const getViewportSizeStub = sinon.stub(utils, 'getViewportSize').returns(100);
  const hasDeterminateSizeStub = sinon.stub(utils, 'hasDeterminateSize').returns(false);
  const mathMinSpy = sinon.spy(Math, 'min');

  const result = getStartAndEnd();

  t.true(instance.getScrollOffset.calledOnce);

  t.true(getViewportSizeStub.calledOnce);
  t.true(getViewportSizeStub.calledWith(instance.scrollParent, instance.props.axis));

  getViewportSizeStub.restore();

  t.true(hasDeterminateSizeStub.calledOnce);
  t.true(hasDeterminateSizeStub.calledWith(instance.props.type, instance.props.itemSizeGetter));

  hasDeterminateSizeStub.restore();

  t.true(instance.getSpaceBefore.notCalled);
  t.true(mathMinSpy.notCalled);

  mathMinSpy.restore();

  t.deepEqual(result, {
    start: 0,
    end: 110
  });
});

test('if createGetStartAndEnd will calculate start and end when hasDeterminateSize is true', (t) => {
  const instance = {
    getScrollOffset: sinon.stub().returns(0),
    getSpaceBefore: sinon.stub().returns(50),
    props: {
      axis: 'y',
      length: 100,
      threshold: 10,
      type: 'uniform'
    },
    scrollParent: {}
  };

  const getStartAndEnd = methods.createGetStartAndEnd(instance);

  t.true(_.isFunction(getStartAndEnd));

  const getViewportSizeStub = sinon.stub(utils, 'getViewportSize').returns(100);
  const hasDeterminateSizeStub = sinon.stub(utils, 'hasDeterminateSize').returns(true);
  const mathMinSpy = sinon.spy(Math, 'min');

  const result = getStartAndEnd();

  t.true(instance.getScrollOffset.calledOnce);

  t.true(getViewportSizeStub.calledOnce);
  t.true(getViewportSizeStub.calledWith(instance.scrollParent, instance.props.axis));

  getViewportSizeStub.restore();

  t.true(hasDeterminateSizeStub.calledOnce);
  t.true(hasDeterminateSizeStub.calledWith(instance.props.type, instance.props.itemSizeGetter));

  hasDeterminateSizeStub.restore();

  t.true(instance.getSpaceBefore.calledOnce);
  t.true(instance.getSpaceBefore.calledWith(instance.props.length));

  t.true(mathMinSpy.calledOnce);

  mathMinSpy.restore();

  t.deepEqual(result, {
    start: 0,
    end: 50
  });
});

test('if createGetVisibleRange will return the first and last indices of visible items', (t) => {
  const itemSize = 30;
  const instance = {
    getSizeOfListItem: sinon.stub().returns(itemSize),
    getSpaceBefore: sinon.stub().callsFake((index) => {
      return index * itemSize;
    }),
    getStartAndEnd: sinon.stub().returns({
      end: 1000,
      start: 15
    }),
    state: {
      from: 5,
      size: 100
    }
  };

  const getVisibleRange = methods.createGetVisibleRange(instance);

  t.true(_.isFunction(getVisibleRange));

  const result = getVisibleRange();

  const viewport = 1000 - 15;
  const items = Math.round(viewport / itemSize);

  t.deepEqual(result, [
    instance.state.from,
    items
  ]);
});

test('if createRenderItems will call itemRenderer for the length of size, and call containerRenderer with the result', (t) => {
  const instance = {
    props: {
      itemRenderer: sinon.spy(),
      containerRenderer: sinon.spy()
    },
    state: {
      from: 5,
      size: 100
    }
  };

  const renderItems = methods.createRenderItems(instance);

  t.true(_.isFunction(renderItems));

  renderItems();

  t.is(instance.props.itemRenderer.callCount, instance.state.size);

  instance.props.itemRenderer.args.forEach((callArgs, index) => {
    t.deepEqual([...callArgs], [
      instance.state.from + index,
      index
    ]);
  });

  t.true(instance.props.containerRenderer.calledOnce);

  const itemsArgs = instance.props.containerRenderer.firstCall.args;

  t.is(itemsArgs.length, 2);

  t.true(_.isArray(itemsArgs[0]));
  t.is(itemsArgs[0].length, instance.state.size);

  t.true(_.isFunction(itemsArgs[1]));
});

test('if createScrollAround will call setScroll with the correct value', (t) => {
  const index = 4;
  const scrollOffset = 100;
  const listItemSize = 30;
  const spaceBefore = 650;
  const viewportSize = 500;

  const instance = {
    getScrollOffset: sinon.stub().returns(scrollOffset),
    getSizeOfListItem: sinon.stub().returns(listItemSize),
    getSpaceBefore: sinon.stub().returns(spaceBefore),
    getViewportSize: sinon.stub().returns(viewportSize),
    setScroll: sinon.spy()
  };

  const scrollAround = methods.createScrollAround(instance);

  t.true(_.isFunction(scrollAround));

  scrollAround(index);

  t.true(instance.setScroll.calledOnce);
  t.true(instance.setScroll.calledWith(spaceBefore - viewportSize + listItemSize));
});

test('if createScrollTo will call setScroll if initialIndex is a number', (t) => {
  const spaceBefore = 123;
  const instance = {
    getSpaceBefore: sinon.stub().returns(spaceBefore),
    props: {
      initialIndex: 2
    },
    setScroll: sinon.spy()
  };

  const scrollTo = methods.createScrollTo(instance);

  t.true(_.isFunction(scrollTo));

  scrollTo();

  t.true(instance.getSpaceBefore.calledOnce);
  t.true(instance.getSpaceBefore.calledWith(instance.props.initialIndex));

  t.true(instance.setScroll.calledOnce);
  t.true(instance.setScroll.calledWith(spaceBefore));
});

test('if createScrollTo will do nothing if initialIndex is not a number', (t) => {
  const spaceBefore = 123;
  const instance = {
    getSpaceBefore: sinon.stub().returns(spaceBefore),
    props: {
      initialIndex: 'foo'
    },
    setScroll: sinon.spy()
  };

  const scrollTo = methods.createScrollTo(instance);

  t.true(_.isFunction(scrollTo));

  scrollTo();

  t.true(instance.getSpaceBefore.notCalled);
  t.true(instance.setScroll.notCalled);
});

test('if createSetReconcileFrameAfterUpdate will assign raf when debounceReconciler is not a number', (t) => {
  const instance = {
    props: {
      debounceReconciler: 'foo'
    },
    reconcileFrameAfterUpdate: null,
    updateFrame() {}
  };

  const setReconcileFrameAfterUpdate = methods.createSetReconcileFrameAfterUpdate(instance);

  t.true(_.isFunction(setReconcileFrameAfterUpdate));

  setReconcileFrameAfterUpdate();

  t.is(instance.reconcileFrameAfterUpdate, raf);
});

test('if createSetReconcileFrameAfterUpdate will assign a debounced method when debounceReconciler is a number', (t) => {
  const instance = {
    props: {
      debounceReconciler: 123
    },
    reconcileFrameAfterUpdate: null,
    updateFrame() {}
  };

  const setReconcileFrameAfterUpdate = methods.createSetReconcileFrameAfterUpdate(instance);

  t.true(_.isFunction(setReconcileFrameAfterUpdate));

  setReconcileFrameAfterUpdate();

  t.not(instance.reconcileFrameAfterUpdate, raf);
  t.is(instance.reconcileFrameAfterUpdate.name, 'debounced');
});

test('if createSetScroll will return immediately if there is no scrollParent', (t) => {
  const fakeDomNode = {};
  const instance = {
    getDomNode: sinon.stub().returns(fakeDomNode),
    props: {
      axis: 'y'
    },
    scrollParent: null
  };

  const setScroll = methods.createSetScroll(instance);

  t.true(_.isFunction(setScroll));

  const scrollToStub = sinon.stub(window, 'scrollTo');
  const getOffsetStub = sinon.stub(utils, 'getOffset').returns(0);

  const currentOffset = 10;

  setScroll(currentOffset);

  t.true(scrollToStub.notCalled);

  scrollToStub.restore();

  t.true(getOffsetStub.notCalled);

  getOffsetStub.restore();
});

test('if createSetScroll will set the specific axis offset if the scrollParent is not the window', (t) => {
  const instance = {
    outerContainer: {},
    props: {
      axis: 'y'
    },
    scrollParent: {}
  };

  const setScroll = methods.createSetScroll(instance);

  t.true(_.isFunction(setScroll));

  const scrollToStub = sinon.stub(window, 'scrollTo');
  const getOffsetStub = sinon.stub(utils, 'getOffset').returns(1);

  const currentOffset = 10;

  setScroll(currentOffset);

  t.true(scrollToStub.notCalled);

  scrollToStub.restore();

  t.true(getOffsetStub.calledTwice);

  const firstArgs = getOffsetStub.firstCall.args;

  t.deepEqual([...firstArgs], [
    instance.outerContainer,
    instance.props.axis
  ]);

  const secondArgs = getOffsetStub.secondCall.args;

  t.deepEqual([...secondArgs], [
    instance.scrollParent,
    instance.props.axis
  ]);

  getOffsetStub.restore();

  t.deepEqual(instance.scrollParent, {
    [constants.SCROLL_START_KEYS[instance.props.axis]]: currentOffset
  });
});

test('if createSetScroll will call scrollTo when the scrollParent is the window', (t) => {
  const instance = {
    outerContainer: {},
    props: {
      axis: 'y'
    },
    scrollParent: window
  };

  const setScroll = methods.createSetScroll(instance);

  t.true(_.isFunction(setScroll));

  const scrollToStub = sinon.stub(window, 'scrollTo');
  const getOffsetStub = sinon.stub(utils, 'getOffset').returns(1);

  const currentOffset = 10;

  setScroll(currentOffset);

  t.true(scrollToStub.calledOnce);
  t.true(scrollToStub.calledWith(0, 11));

  scrollToStub.restore();

  t.true(getOffsetStub.calledOnce);
  t.true(getOffsetStub.calledWith(instance.outerContainer, instance.props.axis));

  getOffsetStub.restore();
});

test('if createSetStateIfAppropriate will only call the callback when state values are equal', (t) => {
  const instance = {
    setState: sinon.spy(),
    state: {}
  };

  const setStateIfAppropriate = methods.createSetStateIfAppropriate(instance);

  t.true(_.isFunction(setStateIfAppropriate));

  const nextState = {};
  const callback = sinon.spy();

  const areStateValuesEqualStub = sinon.stub(utils, 'areStateValuesEqual').returns(true);

  setStateIfAppropriate(nextState, callback);

  t.true(areStateValuesEqualStub.calledOnce);
  t.true(areStateValuesEqualStub.calledWith(instance.state, nextState));

  areStateValuesEqualStub.restore();

  t.true(callback.calledOnce);

  t.true(instance.setState.notCalled);
});

test('if createSetStateIfAppropriate will call setState when the state values are not equal', (t) => {
  const instance = {
    setState: sinon.spy(),
    state: {}
  };

  const setStateIfAppropriate = methods.createSetStateIfAppropriate(instance);

  t.true(_.isFunction(setStateIfAppropriate));

  const nextState = {};
  const callback = sinon.spy();

  const areStateValuesEqualStub = sinon.stub(utils, 'areStateValuesEqual').returns(false);

  setStateIfAppropriate(nextState, callback);

  t.true(areStateValuesEqualStub.calledOnce);
  t.true(areStateValuesEqualStub.calledWith(instance.state, nextState));

  areStateValuesEqualStub.restore();

  t.true(callback.notCalled);

  t.true(instance.setState.calledOnce);
  t.true(instance.setState.calledWith(nextState, callback));
});

test('if createUpdateFrame will call the uniform method when type is uniform', (t) => {
  const instance = {
    props: {
      type: constants.VALID_TYPES.UNIFORM
    },
    updateScrollParent: sinon.spy(),
    updateSimpleFrame: sinon.spy(),
    updateUniformFrame: sinon.spy(),
    updateVariableFrame: sinon.spy()
  };

  const updateFrame = methods.createUpdateFrame(instance);

  t.true(_.isFunction(updateFrame));

  const callback = sinon.spy();

  updateFrame(callback);

  t.true(instance.updateScrollParent.calledOnce);

  t.true(instance.updateUniformFrame.calledOnce);
  t.true(instance.updateUniformFrame.calledWith(callback));

  t.true(instance.updateVariableFrame.notCalled);

  t.true(instance.updateSimpleFrame.notCalled);
});

test('if createUpdateFrame will call the variable method when type is variable', (t) => {
  const instance = {
    props: {
      type: constants.VALID_TYPES.VARIABLE
    },
    updateScrollParent: sinon.spy(),
    updateSimpleFrame: sinon.spy(),
    updateUniformFrame: sinon.spy(),
    updateVariableFrame: sinon.spy()
  };

  const updateFrame = methods.createUpdateFrame(instance);

  t.true(_.isFunction(updateFrame));

  const callback = sinon.spy();

  updateFrame(callback);

  t.true(instance.updateScrollParent.calledOnce);

  t.true(instance.updateUniformFrame.notCalled);

  t.true(instance.updateVariableFrame.calledOnce);
  t.true(instance.updateVariableFrame.calledWith(callback));

  t.true(instance.updateSimpleFrame.notCalled);
});

test('if createUpdateFrame will call the simple method when type is not uniform or variable', (t) => {
  const instance = {
    props: {
      type: 'foo'
    },
    updateScrollParent: sinon.spy(),
    updateSimpleFrame: sinon.spy(),
    updateUniformFrame: sinon.spy(),
    updateVariableFrame: sinon.spy()
  };

  const updateFrame = methods.createUpdateFrame(instance);

  t.true(_.isFunction(updateFrame));

  const callback = sinon.spy();

  updateFrame(callback);

  t.true(instance.updateScrollParent.calledOnce);

  t.true(instance.updateUniformFrame.notCalled);

  t.true(instance.updateVariableFrame.notCalled);

  t.true(instance.updateSimpleFrame.calledOnce);
  t.true(instance.updateSimpleFrame.calledWith(callback));
});

test('if createUpdateFrame will coalesce the callback to noop when not a function', (t) => {
  const instance = {
    props: {
      type: 'foo'
    },
    updateScrollParent: sinon.spy(),
    updateSimpleFrame: sinon.spy(),
    updateUniformFrame: sinon.spy(),
    updateVariableFrame: sinon.spy()
  };

  const updateFrame = methods.createUpdateFrame(instance);

  t.true(_.isFunction(updateFrame));

  const callback = 'NOT_A_FUNCTION';

  updateFrame(callback);

  t.true(instance.updateScrollParent.calledOnce);

  t.true(instance.updateUniformFrame.notCalled);

  t.true(instance.updateVariableFrame.notCalled);

  t.true(instance.updateSimpleFrame.calledOnce);
  t.true(instance.updateSimpleFrame.calledWith(noop));
});

test('if createUpdateScrollParent will do nothing if the current scrollParent is the same as the new', (t) => {
  const scrollParent = {
    addEventListener: sinon.spy(),
    removeEventListener: sinon.spy()
  };
  const instance = {
    getScrollParent: sinon.stub().returns(scrollParent),
    scrollParent,
    updateFrame: sinon.spy()
  };

  const updateScrollParent = methods.createUpdateScrollParent(instance);

  t.true(_.isFunction(updateScrollParent));

  updateScrollParent();

  t.true(instance.getScrollParent.calledOnce);


  t.true(instance.scrollParent.addEventListener.notCalled);
  t.true(instance.scrollParent.removeEventListener.notCalled);
});

test('if createUpdateScrollParent will call addEventListener if there is not current scrollParent', (t) => {
  const scrollParent = {
    addEventListener: sinon.spy(),
    removeEventListener: sinon.spy()
  };
  const instance = {
    getScrollParent: sinon.stub().returns(scrollParent),
    scrollParent: null,
    updateFrame: sinon.spy()
  };

  const updateScrollParent = methods.createUpdateScrollParent(instance);

  t.true(_.isFunction(updateScrollParent));

  updateScrollParent();

  t.true(instance.getScrollParent.calledOnce);


  t.true(instance.scrollParent.addEventListener.calledTwice);

  const firstAddArgs = instance.scrollParent.addEventListener.firstCall.args;

  t.deepEqual([...firstAddArgs], [
    'scroll',
    instance.updateFrame,
    constants.ADD_EVENT_LISTENER_OPTIONS
  ]);

  const secondAddArgs = instance.scrollParent.addEventListener.secondCall.args;

  t.deepEqual([...secondAddArgs], [
    'mousewheel',
    noop,
    constants.ADD_EVENT_LISTENER_OPTIONS
  ]);

  t.true(instance.scrollParent.removeEventListener.notCalled);
});

test('if createUpdateScrollParent will call removeEventListener and then addEventListener if there is a current scrollParent', (t) => {
  const scrollParent = {
    addEventListener: sinon.spy(),
    removeEventListener: sinon.spy()
  };
  const currentScrollParent = {
    addEventListener: sinon.spy(),
    removeEventListener: sinon.spy()
  };
  const instance = {
    getScrollParent: sinon.stub().returns(scrollParent),
    scrollParent: currentScrollParent,
    updateFrame: sinon.spy()
  };

  const updateScrollParent = methods.createUpdateScrollParent(instance);

  t.true(_.isFunction(updateScrollParent));

  updateScrollParent();

  t.true(instance.getScrollParent.calledOnce);


  t.true(instance.scrollParent.addEventListener.calledTwice);

  const firstAddArgs = instance.scrollParent.addEventListener.firstCall.args;

  t.deepEqual([...firstAddArgs], [
    'scroll',
    instance.updateFrame,
    constants.ADD_EVENT_LISTENER_OPTIONS
  ]);

  const secondAddArgs = instance.scrollParent.addEventListener.secondCall.args;

  t.deepEqual([...secondAddArgs], [
    'mousewheel',
    noop,
    constants.ADD_EVENT_LISTENER_OPTIONS
  ]);

  t.true(scrollParent.removeEventListener.notCalled);

  t.true(currentScrollParent.removeEventListener.calledTwice);

  const firstRemoveArgs = currentScrollParent.removeEventListener.firstCall.args;

  t.deepEqual([...firstRemoveArgs], [
    'scroll',
    instance.updateFrame
  ]);

  const secondRemoveArgs = currentScrollParent.removeEventListener.secondCall.args;

  t.deepEqual([...secondRemoveArgs], [
    'mousewheel',
    noop
  ]);
});

test('if createUpdateSimpleFrame will not set state if the element end is greater than the end', (t) => {
  const instance = {
    items: {
      children: ['foo']
    },
    getStartAndEnd: sinon.stub().returns({
      end: 10,
      start: 0
    }),
    props: {
      pageSize: 10,
      length: 1000
    },
    state: {
      size: 1000
    },
    setStateIfAppropriate: sinon.spy()
  };

  const updateSimpleFrame = methods.createUpdateSimpleFrame(instance);

  t.true(_.isFunction(updateSimpleFrame));

  const callback = sinon.spy();
  const getCalculatedElementEndStub = sinon.stub(utils, 'getCalculatedElementEnd').returns(11);

  updateSimpleFrame(callback);

  t.true(getCalculatedElementEndStub.calledOnce);
  t.true(getCalculatedElementEndStub.calledWith(instance.items.children, instance.props));

  getCalculatedElementEndStub.restore();

  t.true(callback.calledOnce);

  t.true(instance.setStateIfAppropriate.notCalled);
});

test('if createUpdateSimpleFrame will set state if the element end is not greater than the end', (t) => {
  const instance = {
    items: {
      children: ['foo']
    },
    getStartAndEnd: sinon.stub().returns({
      end: 100,
      start: 0
    }),
    props: {
      pageSize: 10,
      length: 1000
    },
    state: {
      size: 1000
    },
    setStateIfAppropriate: sinon.spy()
  };

  const updateSimpleFrame = methods.createUpdateSimpleFrame(instance);

  t.true(_.isFunction(updateSimpleFrame));

  const callback = sinon.spy();
  const getCalculatedElementEndStub = sinon.stub(utils, 'getCalculatedElementEnd').returns(11);

  updateSimpleFrame(callback);

  t.true(getCalculatedElementEndStub.calledOnce);
  t.true(getCalculatedElementEndStub.calledWith(instance.items.children, instance.props));

  getCalculatedElementEndStub.restore();

  t.true(callback.notCalled);

  t.true(instance.setStateIfAppropriate.calledOnce);

  const args = instance.setStateIfAppropriate.firstCall.args;

  t.is(args.length, 2);

  t.deepEqual(args[0], {
    size: instance.props.length
  });
  t.is(args[1], callback);
});

test('if createUpdateUniformFrame will not set state if there is no itemSize or itemsPerRow', (t) => {
  const itemSizeAndItemsPerRow = {
    itemSize: 0,
    itemsPerRow: 1
  };
  const startAndEnd = {
    end: 100,
    start: 0
  };
  const instance = {
    getItemSizeAndItemsPerRow: sinon.stub().returns(itemSizeAndItemsPerRow),
    getStartAndEnd: sinon.stub().returns(startAndEnd),
    props: {},
    setStateIfAppropriate: sinon.spy()
  };

  const updateUniformFrame = methods.createUpdateUniformFrame(instance);

  t.true(_.isFunction(updateUniformFrame));

  const callback = sinon.spy();
  const fromAndSize = {
    from: 0,
    size: 50
  };

  const getFromAndSizeStub = sinon.stub(utils, 'getFromAndSize').returns(fromAndSize);

  updateUniformFrame(callback);

  t.true(instance.getItemSizeAndItemsPerRow.calledOnce);

  t.true(callback.calledOnce);

  t.true(instance.getStartAndEnd.notCalled);

  t.true(getFromAndSizeStub.notCalled);

  getFromAndSizeStub.restore();

  t.true(instance.setStateIfAppropriate.notCalled);
});

test('if createUpdateUniformFrame will set state if there is itemSize or itemsPerRow', (t) => {
  const itemSizeAndItemsPerRow = {
    itemSize: 100,
    itemsPerRow: 1
  };
  const startAndEnd = {
    end: 100,
    start: 0
  };
  const instance = {
    getItemSizeAndItemsPerRow: sinon.stub().returns(itemSizeAndItemsPerRow),
    getStartAndEnd: sinon.stub().returns(startAndEnd),
    props: {},
    setStateIfAppropriate: sinon.spy()
  };

  const updateUniformFrame = methods.createUpdateUniformFrame(instance);

  t.true(_.isFunction(updateUniformFrame));

  const callback = sinon.spy();
  const fromAndSize = {
    from: 0,
    size: 50
  };

  const getFromAndSizeStub = sinon.stub(utils, 'getFromAndSize').returns(fromAndSize);

  updateUniformFrame(callback);

  t.true(instance.getItemSizeAndItemsPerRow.calledOnce);

  t.true(callback.notCalled);

  t.true(instance.getStartAndEnd.calledOnce);

  t.true(getFromAndSizeStub.calledOnce);
  t.true(getFromAndSizeStub.calledWith(0, 2, itemSizeAndItemsPerRow.itemsPerRow, instance.props));

  getFromAndSizeStub.restore();

  t.true(instance.setStateIfAppropriate.calledOnce);

  const args = instance.setStateIfAppropriate.firstCall.args;

  t.deepEqual(args[0], {
    ...fromAndSize,
    ...itemSizeAndItemsPerRow
  });
  t.is(args[1], callback);
});

test('if createUpdateVariableFrame will call setStateIfAppropriate with the new from and size', (t) => {
  const startAndEnd = {};
  const instance = {
    cache: {},
    getSizeOfListItem() {},
    getStartAndEnd: sinon.stub().returns(startAndEnd),
    items: {},
    props: {
      axis: 'y',
      itemSizeGetter() {}
    },
    setStateIfAppropriate: sinon.spy(),
    state: {
      from: 5
    }
  };

  const updateVariableFrame = methods.createUpdateVariableFrame(instance);

  t.true(_.isFunction(updateVariableFrame));

  const callback = sinon.spy();

  const fromAndSize = {};

  const setCacheSizesStub = sinon.stub(utils, 'setCacheSizes');
  const getFromAndSizeFromListItemSizeStub = sinon.stub(utils, 'getFromAndSizeFromListItemSize').returns(fromAndSize);

  updateVariableFrame(callback);

  t.true(setCacheSizesStub.notCalled);

  setCacheSizesStub.restore();

  t.true(instance.getStartAndEnd.calledOnce);

  t.true(getFromAndSizeFromListItemSizeStub.calledOnce);
  t.true(getFromAndSizeFromListItemSizeStub.calledWith(startAndEnd, instance.props, instance.getSizeOfListItem));

  getFromAndSizeFromListItemSizeStub.restore();

  t.true(instance.setStateIfAppropriate.calledOnce);
  t.true(instance.setStateIfAppropriate.calledWith(fromAndSize, callback));
});

test('if createUpdateVariableFrame will call setStateIfAppropriate and setCacheSizes if no itemSizeGetter exists', (t) => {
  const startAndEnd = {};
  const instance = {
    cache: {},
    items: {},
    getSizeOfListItem() {},
    getStartAndEnd: sinon.stub().returns(startAndEnd),
    props: {
      axis: 'y'
    },
    setStateIfAppropriate: sinon.spy(),
    state: {
      from: 5
    }
  };

  const updateVariableFrame = methods.createUpdateVariableFrame(instance);

  t.true(_.isFunction(updateVariableFrame));

  const callback = sinon.spy();

  const fromAndSize = {};

  const setCacheSizesStub = sinon.stub(utils, 'setCacheSizes');
  const getFromAndSizeFromListItemSizeStub = sinon.stub(utils, 'getFromAndSizeFromListItemSize').returns(fromAndSize);

  updateVariableFrame(callback);

  t.true(setCacheSizesStub.calledOnce);
  t.true(setCacheSizesStub.calledWith(instance.state.from, instance.items, instance.props.axis, instance.cache));

  setCacheSizesStub.restore();

  t.true(instance.getStartAndEnd.calledOnce);

  t.true(getFromAndSizeFromListItemSizeStub.calledOnce);
  t.true(getFromAndSizeFromListItemSizeStub.calledWith(startAndEnd, instance.props, instance.getSizeOfListItem));

  getFromAndSizeFromListItemSizeStub.restore();

  t.true(instance.setStateIfAppropriate.calledOnce);
  t.true(instance.setStateIfAppropriate.calledWith(fromAndSize, callback));
});
