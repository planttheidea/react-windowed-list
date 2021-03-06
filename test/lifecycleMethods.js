// test
import test from 'ava';
import raf from 'raf';
import ReactDOM from 'react-dom';
import sinon from 'sinon';

// src
import * as methods from 'src/lifecycleMethods';
import * as constants from 'src/constants';
import * as utils from 'src/utils';
import {getDerivedStateFromProps} from '../src/lifecycleMethods';

const waitForRaf = () => new Promise(raf);

test('if onConstruct will set the state with the right object', (t) => {
  const instance = {
    props: {
      initialIndex: 0
    },
    setReconcileFrameAfterUpdate: sinon.spy(),
    state: {}
  };

  const fromAndSize = {
    from: 'foo',
    size: 'bar'
  };

  const getFromAndSizeStub = sinon.stub(utils, 'getFromAndSize').returns(fromAndSize);

  methods.onConstruct(instance);

  t.true(getFromAndSizeStub.calledOnce);
  t.true(getFromAndSizeStub.calledWith(instance.props.initialIndex, 0, 1, instance.props));

  getFromAndSizeStub.restore();

  t.true(instance.setReconcileFrameAfterUpdate.calledOnce);
  t.deepEqual(instance.state, {
    ...fromAndSize,
    itemsPerRow: 1
  });
});

test('if componentDidMount will fire updateFrame on the next animationFrame', async (t) => {
  const instance = {
    props: {
      isHidden: false
    },
    scrollTo: sinon.spy(),
    updateFrame: sinon.spy()
  };
  const findDOMNodeStub = sinon.stub(ReactDOM, 'findDOMNode').returns({});

  methods.componentDidMount(instance);

  t.true(findDOMNodeStub.calledOnce);
  t.true(findDOMNodeStub.calledWith(instance));

  findDOMNodeStub.restore();

  t.true(instance.updateFrame.notCalled);
  t.true(instance.scrollTo.notCalled);

  await waitForRaf();

  t.true(instance.updateFrame.calledOnce);
  t.true(instance.updateFrame.calledWith(instance.scrollTo));
});

test('if componentDidMount will not fire updateFrame if hidden', async (t) => {
  const instance = {
    props: {
      isHidden: true
    },
    scrollTo: sinon.spy(),
    updateFrame: sinon.spy()
  };
  const findDOMNodeStub = sinon.stub(ReactDOM, 'findDOMNode').returns({});

  methods.componentDidMount(instance);

  t.true(findDOMNodeStub.calledOnce);
  t.true(findDOMNodeStub.calledWith(instance));

  findDOMNodeStub.restore();

  t.true(instance.updateFrame.notCalled);
  t.true(instance.scrollTo.notCalled);

  await waitForRaf();

  t.true(instance.updateFrame.notCalled);
});

test('if getDerivedStateFromProps will return the next state if from has changed', (t) => {
  const nextProps = {
    isLazy: false,
    length: 100,
    minSize: 1,
    pageSize: 10,
    type: 'variable'
  };
  const prevState = {
    from: nextProps.length + 1,
    itemsPerRow: 1,
    size: 10
  };

  const result = getDerivedStateFromProps(nextProps, prevState);

  t.deepEqual(result, {
    from: 90,
    size: 10
  });
});

test('if getDerivedStateFromProps will return null if nothing has changed', (t) => {
  const nextProps = {
    isLazy: false,
    length: 100,
    minSize: 1,
    pageSize: 10,
    type: 'variable'
  };
  const prevState = {
    from: 0,
    itemsPerRow: 1,
    size: 10
  };

  const result = getDerivedStateFromProps(nextProps, prevState);

  t.is(result, null);
});

test('if getDerivedStateFromProps will return the next state if size has changed', (t) => {
  const nextProps = {
    isLazy: false,
    length: 100,
    minSize: 1,
    pageSize: 10,
    type: 'variable'
  };
  const prevState = {
    from: 0,
    itemsPerRow: 1,
    size: 5
  };

  const result = getDerivedStateFromProps(nextProps, prevState);

  t.deepEqual(result, {
    from: 0,
    size: 10
  });
});

test('if componentWillReceiveProps will fire setStateIfAppropriate with the result from getFromAndSize', (t) => {
  const instance = {
    props: {},
    setStateIfAppropriate: sinon.spy(),
    state: {
      from: 'foo',
      itemsPerRow: 'bar',
      size: 'baz'
    }
  };

  const fromAndSize = {
    from: 'foo',
    size: 'bar'
  };

  const getFromAndSizeStub = sinon.stub(utils, 'getFromAndSize').returns(fromAndSize);

  const nextProps = {
    foo: 'bar'
  };

  methods.componentWillReceiveProps(instance, [nextProps]);

  t.true(getFromAndSizeStub.calledOnce);
  t.true(
    getFromAndSizeStub.calledWith(instance.state.from, instance.state.size, instance.state.itemsPerRow, nextProps)
  );

  getFromAndSizeStub.restore();

  t.true(instance.setStateIfAppropriate.calledOnce);
  t.true(instance.setStateIfAppropriate.calledWith(fromAndSize));
});

test('if componentWillReceiveProps will fire setReconcileFrameAfterUpdate if debounceReconciler has changed', (t) => {
  const instance = {
    props: {},
    setReconcileFrameAfterUpdate: sinon.spy(),
    setStateIfAppropriate: sinon.spy(),
    state: {
      from: 'foo',
      itemsPerRow: 'bar',
      size: 'baz'
    }
  };

  const fromAndSize = {
    from: 'foo',
    size: 'baz'
  };

  const getFromAndSizeStub = sinon.stub(utils, 'getFromAndSize').returns(fromAndSize);

  const nextProps = {
    debounceReconciler: 123
  };

  methods.componentWillReceiveProps(instance, [nextProps]);

  t.true(getFromAndSizeStub.calledOnce);
  t.true(
    getFromAndSizeStub.calledWith(instance.state.from, instance.state.size, instance.state.itemsPerRow, nextProps)
  );

  getFromAndSizeStub.restore();

  t.true(instance.setReconcileFrameAfterUpdate.calledOnce);

  t.true(instance.setStateIfAppropriate.calledOnce);
  t.true(instance.setStateIfAppropriate.calledWith(fromAndSize));
});

test('if getSnapshotBeforeUpdate will set the reconcile frame if debounceReconciler has changed', (t) => {
  const instance = {
    props: {
      debounceReconciler: 100
    },
    setReconcileFrameAfterUpdate: sinon.spy()
  };
  const previousProps = {
    ...instance.props,
    debounceReconciler: 50
  };

  methods.getSnapshotBeforeUpdate(instance, [previousProps]);

  t.true(instance.setReconcileFrameAfterUpdate.calledOnce);
});

test('if getSnapshotBeforeUpdate will not set the reconcile frame if debounceReconciler has not changed', (t) => {
  const instance = {
    props: {
      debounceReconciler: 100
    },
    setReconcileFrameAfterUpdate: sinon.spy()
  };
  const previousProps = {
    ...instance.props
  };

  methods.getSnapshotBeforeUpdate(instance, [previousProps]);

  t.true(instance.setReconcileFrameAfterUpdate.notCalled);
});

test('if componentDidUpdate will not fire anything if unstable', async (t) => {
  const initialUpdateCounter = constants.MAX_SYNC_UPDATES + 1;
  const initialUpdateCounterTimeoutId = 1;

  const instance = {
    props: {
      isHidden: false
    },
    unstableTimeoutId: 123,
    updateCounter: initialUpdateCounter,
    updateCounterTimeoutId: initialUpdateCounterTimeoutId,
    updateFrame: sinon.spy()
  };

  const clearTimeoutStub = sinon.stub(global, 'clearTimeout');
  const setTimeoutStub = sinon.stub(global, 'setTimeout').returns(234);
  const consoleErrorStub = sinon.stub(console, 'error');

  methods.componentDidUpdate(instance);

  t.true(consoleErrorStub.notCalled);

  consoleErrorStub.restore();

  t.true(clearTimeoutStub.calledOnce);
  t.true(clearTimeoutStub.calledWith(123));

  clearTimeoutStub.restore();

  t.true(setTimeoutStub.calledOnce);
  const [fn, timeoutValue] = setTimeoutStub.args[0];

  fn();

  t.is(instance.unstableTimeoutId, null);
  t.is(instance.updateCounter, 0);

  t.is(timeoutValue, constants.UNSTABLE_TIMEOUT);

  setTimeoutStub.restore();

  await waitForRaf();

  t.true(instance.updateFrame.notCalled);
});

test('if componentDidUpdate will set unstable to true and fire the console if the counter is over the MAX_SYNC_UPDATES', async (t) => {
  const initialUpdateCounter = constants.MAX_SYNC_UPDATES;
  const initialUpdateCounterTimeoutId = 1;

  const instance = {
    props: {
      isHidden: false
    },
    unstableTimeoutId: null,
    updateCounter: initialUpdateCounter,
    updateCounterTimeoutId: initialUpdateCounterTimeoutId,
    updateFrame: sinon.spy()
  };

  const clearTimeoutStub = sinon.stub(global, 'clearTimeout');
  const setTimeoutStub = sinon.stub(global, 'setTimeout').returns(234);
  const consoleErrorStub = sinon.stub(console, 'error');

  methods.componentDidUpdate(instance);

  t.true(consoleErrorStub.calledOnce);
  t.true(consoleErrorStub.calledWith(constants.UNSTABLE_MESSAGE));

  consoleErrorStub.restore();

  t.true(clearTimeoutStub.calledOnce);
  t.true(clearTimeoutStub.calledWith(null));

  clearTimeoutStub.restore();

  t.true(setTimeoutStub.calledOnce);
  const [fn, timeoutValue] = setTimeoutStub.args[0];

  fn();

  t.is(instance.unstableTimeoutId, null);
  t.is(instance.updateCounter, 0);

  t.is(timeoutValue, constants.UNSTABLE_TIMEOUT);

  setTimeoutStub.restore();

  await waitForRaf();

  t.true(instance.updateFrame.notCalled);
});

test('if componentDidUpdate will set the updateCounterTimeoutId if is falsy', async (t) => {
  const initialUpdateCounter = 3;
  const initialUpdateCounterTimeoutId = null;

  const instance = {
    props: {
      isHidden: false
    },
    reconcileFrameAfterUpdate: sinon.spy(),
    unstable: false,
    updateCounter: initialUpdateCounter,
    updateCounterTimeoutId: initialUpdateCounterTimeoutId,
    updateFrame: sinon.spy()
  };

  const consoleErrorStub = sinon.stub(console, 'error');

  methods.componentDidUpdate(instance);

  t.true(consoleErrorStub.notCalled);

  consoleErrorStub.restore();

  t.not(instance.updateCounter, 0);
  t.not(instance.updateCounterTimeoutId, initialUpdateCounterTimeoutId);

  await waitForRaf();

  t.false(instance.unstable);
  t.is(instance.updateCounter, 0);
  t.is(instance.updateCounterTimeoutId, initialUpdateCounterTimeoutId);

  t.true(instance.reconcileFrameAfterUpdate.calledOnce);
  t.true(instance.reconcileFrameAfterUpdate.calledWith(instance.updateFrame));
});

test('if componentDidUpdate will just call updateFrame if there is an updateCounterTimeoutId', async (t) => {
  const initialUpdateCounter = 3;
  const initialUpdateCounterTimeoutId = 2;

  const instance = {
    props: {
      isHidden: false
    },
    reconcileFrameAfterUpdate: sinon.spy(),
    unstable: false,
    updateCounter: initialUpdateCounter,
    updateCounterTimeoutId: initialUpdateCounterTimeoutId,
    updateFrame: sinon.spy()
  };

  const consoleErrorStub = sinon.stub(console, 'error');

  methods.componentDidUpdate(instance);

  t.true(consoleErrorStub.notCalled);

  consoleErrorStub.restore();

  await waitForRaf();

  t.false(instance.unstable);
  t.is(instance.updateCounter, initialUpdateCounter + 1);
  t.is(instance.updateCounterTimeoutId, initialUpdateCounterTimeoutId);

  t.true(instance.reconcileFrameAfterUpdate.calledOnce);
  t.true(instance.reconcileFrameAfterUpdate.calledWith(instance.updateFrame));
});

test('if componentDidUpdate will not call updateFrame if hidden', async (t) => {
  const initialUpdateCounter = 3;
  const initialUpdateCounterTimeoutId = 2;

  const instance = {
    props: {
      isHidden: true
    },
    reconcileFrameAfterUpdate: sinon.spy(),
    unstable: false,
    updateCounter: initialUpdateCounter,
    updateCounterTimeoutId: initialUpdateCounterTimeoutId,
    updateFrame: sinon.spy()
  };

  const consoleErrorStub = sinon.stub(console, 'error');

  methods.componentDidUpdate(instance);

  t.true(consoleErrorStub.notCalled);

  consoleErrorStub.restore();

  await waitForRaf();

  t.false(instance.unstable);
  t.is(instance.updateCounter, initialUpdateCounter + 1);
  t.is(instance.updateCounterTimeoutId, initialUpdateCounterTimeoutId);

  t.true(instance.reconcileFrameAfterUpdate.notCalled);
});

test('if componentWillUnmount will call removeEventListener on the scroll parent', (t) => {
  const instance = {
    scrollParent: {
      removeEventListener: sinon.spy()
    },
    updateFrame() {}
  };

  methods.componentWillUnmount(instance);

  t.true(instance.scrollParent.removeEventListener.calledTwice);

  const firstCallArgs = instance.scrollParent.removeEventListener.getCall(0).args;

  t.deepEqual([...firstCallArgs], ['scroll', instance.updateFrame, constants.ADD_EVENT_LISTENER_OPTIONS]);

  const secondCallArgs = instance.scrollParent.removeEventListener.getCall(1).args;

  t.deepEqual([...secondCallArgs], ['mousewheel', utils.noop, constants.ADD_EVENT_LISTENER_OPTIONS]);
});
