// test
import test from 'ava';
import _ from 'lodash';
import noop from 'lodash/noop';
import raf from 'raf';
import sinon from 'sinon';

// src
import * as methods from 'src/lifecycleMethods';
import * as constants from 'src/constants';
import * as utils from 'src/utils';

const waitForRaf = () => {
  return new Promise((resolve) => {
    raf(resolve);
  });
};

test('if createComponentDidMount will create a method that will fire updateFrame on the next animationFrame', async (t) => {
  const instance = {
    scrollTo: sinon.spy(),
    updateFrame: sinon.spy()
  };

  const componentDidMount = methods.createComponentDidMount(instance);

  t.true(_.isFunction(componentDidMount));

  componentDidMount();

  t.true(instance.updateFrame.notCalled);
  t.true(instance.scrollTo.notCalled);

  await waitForRaf();

  t.true(instance.updateFrame.calledOnce);
  t.true(instance.updateFrame.calledWith(instance.scrollTo));
});

test('if createComponentDidUpdate will not fire anything if unstable', async (t) => {
  const initialUpdateCounter = constants.MAX_SYNC_UPDATES + 1;
  const initialUpdateCounterTimeoutId = 1;

  const instance = {
    unstable: true,
    updateCounter: initialUpdateCounter,
    updateCounterTimeoutId: initialUpdateCounterTimeoutId,
    updateFrame: sinon.spy()
  };

  const componentDidUpdate = methods.createComponentDidUpdate(instance);

  t.true(_.isFunction(componentDidUpdate));

  const consoleErrorStub = sinon.stub(console, 'error');

  componentDidUpdate();

  t.true(consoleErrorStub.notCalled);

  consoleErrorStub.restore();

  await waitForRaf();

  t.true(instance.unstable);
  t.is(instance.updateCounter, initialUpdateCounter);
  t.is(instance.updateCounterTimeoutId, initialUpdateCounterTimeoutId);

  await waitForRaf();

  t.true(instance.updateFrame.notCalled);
});

test('if createComponentDidUpdate will set unstable to true and fire the console if the counter is over the MAX_SYNC_UPDATES', async (t) => {
  const initialUpdateCounter = constants.MAX_SYNC_UPDATES;
  const initialUpdateCounterTimeoutId = 1;

  const instance = {
    unstable: false,
    updateCounter: initialUpdateCounter,
    updateCounterTimeoutId: initialUpdateCounterTimeoutId,
    updateFrame: sinon.spy()
  };

  const componentDidUpdate = methods.createComponentDidUpdate(instance);

  t.true(_.isFunction(componentDidUpdate));

  const consoleErrorStub = sinon.stub(console, 'error');

  componentDidUpdate();

  t.true(consoleErrorStub.calledOnce);
  t.true(consoleErrorStub.calledWith(constants.UNSTABLE_MESSAGE));

  consoleErrorStub.restore();

  await waitForRaf();

  t.true(instance.unstable);
  t.is(instance.updateCounter, initialUpdateCounter + 1);
  t.is(instance.updateCounterTimeoutId, initialUpdateCounterTimeoutId);

  await waitForRaf();

  t.true(instance.updateFrame.notCalled);
});

test('if createComponentDidUpdate will set the updateCounterTimeoutId if is falsy', async (t) => {
  const initialUpdateCounter = 3;
  const initialUpdateCounterTimeoutId = null;

  const instance = {
    unstable: false,
    updateCounter: initialUpdateCounter,
    updateCounterTimeoutId: initialUpdateCounterTimeoutId,
    updateFrame: sinon.spy()
  };

  const componentDidUpdate = methods.createComponentDidUpdate(instance);

  t.true(_.isFunction(componentDidUpdate));

  const consoleErrorStub = sinon.stub(console, 'error');

  componentDidUpdate();

  t.true(consoleErrorStub.notCalled);

  consoleErrorStub.restore();

  await waitForRaf();

  t.false(instance.unstable);
  t.is(instance.updateCounter, 0);
  t.not(instance.updateCounterTimeoutId, initialUpdateCounterTimeoutId);

  await waitForRaf();

  t.true(instance.updateFrame.calledOnce);
});

test('if createComponentDidUpdate will just call updateFrame if there is an updateCounterTimeoutId', async (t) => {
  const initialUpdateCounter = 3;
  const initialUpdateCounterTimeoutId = 2;

  const instance = {
    unstable: false,
    updateCounter: initialUpdateCounter,
    updateCounterTimeoutId: initialUpdateCounterTimeoutId,
    updateFrame: sinon.spy()
  };

  const componentDidUpdate = methods.createComponentDidUpdate(instance);

  t.true(_.isFunction(componentDidUpdate));

  const consoleErrorStub = sinon.stub(console, 'error');

  componentDidUpdate();

  t.true(consoleErrorStub.notCalled);

  consoleErrorStub.restore();

  await waitForRaf();

  t.false(instance.unstable);
  t.is(instance.updateCounter, initialUpdateCounter + 1);
  t.is(instance.updateCounterTimeoutId, initialUpdateCounterTimeoutId);

  await waitForRaf();

  t.true(instance.updateFrame.calledOnce);
});

test('if createComponentWillMount will call setState with the right object', (t) => {
  const instance = {
    props: {
      initialIndex: 0
    },
    setState: sinon.spy()
  };

  const componentWillMount = methods.createComponentWillMount(instance);

  t.true(_.isFunction(componentWillMount));

  const fromAndSize = {
    from: 'foo',
    size: 'bar'
  };

  const getFromAndSizeStub = sinon.stub(utils, 'getFromAndSize').returns(fromAndSize);

  componentWillMount();

  t.true(getFromAndSizeStub.calledOnce);
  t.true(getFromAndSizeStub.calledWith(instance.props.initialIndex, 0, 1, instance.props));

  getFromAndSizeStub.restore();

  t.true(instance.setState.calledOnce);

  const args = instance.setState.getCall(0).args;

  t.deepEqual([...args], [
    {
      ...fromAndSize,
      itemsPerRow: 1
    }
  ]);
});

test('if createComponentWillReceiveProps will fire setStateIfAppropriate with the result from getFromAndSize', (t) => {
  const instance = {
    setStateIfAppropriate: sinon.spy(),
    state: {
      from: 'foo',
      itemsPerRow: 'bar',
      size: 'baz'
    }
  };

  const componentWillReceiveProps = methods.createComponentWillReceiveProps(instance);

  t.true(_.isFunction(componentWillReceiveProps));

  const fromAndSize = {
    from: 'foo',
    size: 'bar'
  };

  const getFromAndSizeStub = sinon.stub(utils, 'getFromAndSize').returns(fromAndSize);

  const nextProps = {
    foo: 'bar'
  };

  componentWillReceiveProps(nextProps);

  t.true(getFromAndSizeStub.calledOnce);
  t.true(getFromAndSizeStub.calledWith(instance.state.from, instance.state.size,
    instance.state.itemsPerRow, nextProps));

  getFromAndSizeStub.restore();

  t.true(instance.setStateIfAppropriate.calledOnce);
  t.true(instance.setStateIfAppropriate.calledWith(fromAndSize));
});

test('if createComponentWillUnmount will call removeEventListener on the scroll parent', (t) => {
  const instance = {
    scrollParent: {
      removeEventListener: sinon.spy()
    },
    updateFrame() {}
  };

  const componentWillUnmount = methods.createComponentWillUnmount(instance);

  t.true(_.isFunction(componentWillUnmount));

  componentWillUnmount();

  t.true(instance.scrollParent.removeEventListener.calledTwice);

  const firstCallArgs = instance.scrollParent.removeEventListener.getCall(0).args;

  t.deepEqual([...firstCallArgs], [
    'scroll',
    instance.updateFrame,
    constants.ADD_EVENT_LISTENER_OPTIONS
  ]);

  const secondCallArgs = instance.scrollParent.removeEventListener.getCall(1).args;

  t.deepEqual([...secondCallArgs], [
    'mousewheel',
    noop,
    constants.ADD_EVENT_LISTENER_OPTIONS
  ]);
});

test('if getInitialState returns the correct state', (t) => {
  const result = methods.getInitialState();

  t.deepEqual(result, {
    from: 0,
    itemsPerRow: 0,
    size: 0
  });
});
