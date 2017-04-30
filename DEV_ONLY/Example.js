import React from 'react';
import WindowedList from '../src';

const renderItem = (index, key) => {
  return (
    <div
      className={`item${index % 2 ? '' : ' even'}`}
      key={key}
    >
      {index}
    </div>
  );
};

renderItem.toJSON = () => {
  return renderItem.toString();
};

const renderSquareItem = (index, key) => {
  return (
      <div
        className={`square-item${index % 2 ? '' : ' even'}`}
        key={key}
      >
        {index}
      </div>
  );
};

renderSquareItem.toJSON = () => {
  return renderSquareItem.toString();
};

const getHeight = (index) => {
  return 30 + (10 * (index % 10));
};

getHeight.toJSON = () => {
  return getHeight.toString();
};

const getWidth = (index) => {
  return 100 + (10 * (index % 10));
};

getWidth.toJSON = () => {
  return getWidth.toString();
};

const renderVariableHeightItem = (index, key) => {
  return (
    <div
      className={`item${index % 2 ? '' : ' even'}`}
      key={key}
      style={{
        lineHeight: `${getHeight(index)}px`
      }}
    >
      {index}
    </div>
  );
};
renderVariableHeightItem.toJSON = () => {
  return renderVariableHeightItem.toString();
};

const renderVariableWidthItem = (index, key) => {
  return (
    <div
      className={`item${index % 2 ? '' : ' even'}`}
      key={key}
      style={{
        width: `${getWidth(index)}px`
      }}
    >
      {index}
    </div>
  );
};
renderVariableWidthItem.toJSON = () => renderVariableWidthItem.toString();

const renderGridLine = (row, key) => {
  return (
    <WindowedList
      axis="x"
      key={key}
      length={10000}
      itemRenderer={
        (column, key) => renderSquareItem(column + (10000 * row), key)
      }
      type="uniform"
    />
  );
};

renderGridLine.toJSON = () => {
  return renderGridLine.toString();
};

const examples = [
  {
    length: 10000,
    itemRenderer: renderVariableHeightItem
  },
  {
    axis: 'x',
    length: 10000,
    itemRenderer: renderVariableWidthItem
  },
  {
    length: 10000,
    itemRenderer: renderVariableHeightItem,
    type: 'variable'
  },
  {
    axis: 'x',
    length: 10000,
    itemRenderer: renderVariableWidthItem,
    type: 'variable'
  },
  {
    length: 10000,
    itemRenderer: renderVariableHeightItem,
    itemSizeGetter: getHeight,
    type: 'variable'
  },
  {
    axis: 'x',
    length: 10000,
    itemRenderer: renderVariableWidthItem,
    itemSizeGetter: getWidth,
    threshold: 0,
    type: 'variable'
  },
  {
    length: 10000,
    initialIndex: 5000,
    itemRenderer: renderVariableHeightItem,
    itemSizeGetter: getHeight,
    type: 'variable'
  },
  {
    length: 10000,
    itemRenderer: renderItem,
    type: 'uniform'
  },
  {
    axis: 'x',
    length: 10000,
    itemRenderer: renderItem,
    type: 'uniform'
  },
  {
    length: 10000,
    itemRenderer: renderSquareItem,
    type: 'uniform'
  },
  {
    length: 10000,
    initialIndex: 5000,
    itemRenderer: renderItem,
    type: 'uniform'
  },
  {
    length: 10000,
    itemRenderer: renderGridLine,
    type: 'uniform',
    useTranslate3d: true
  }
];

const Example = () => {
  return (
    <div className="index">
      <div className="header">
        WindowedList
      </div>

      <div className="examples">
        {examples.map((props, key) => {
          return (
            <div key={key} className={`example axis-${props.axis}`}>
              <strong>
                Props
              </strong>

              <pre className="props">
                {JSON.stringify(props, null, 2)}
              </pre>

              <strong>
                Component
              </strong>

              <div className="component">
                <WindowedList {...props} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Example;
