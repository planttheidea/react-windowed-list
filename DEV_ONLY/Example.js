import React, {
  PureComponent
} from 'react';
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

renderVariableWidthItem.toJSON = () => {
  return renderVariableWidthItem.toString();
};

const renderGridLine = (row, key) => {
  const gridLineItemRenderer = (column, key) => {
    return renderSquareItem(column + (10000 * row), key);
  };

  return (
    <WindowedList
      axis="x"
      itemRenderer={gridLineItemRenderer}
      key={key}
      length={10000}
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
  },
  {
    length: 10000,
    itemRenderer: renderGridLine,
    type: 'uniform',
    usePosition: true
  }
];

const hiddenProps = {
  length: 10000,
  itemRenderer: renderItem,
  type: 'uniform'
};

class Example extends PureComponent {
  state = {
    isVisible: false
  };

  onClickToggleIsVisible = () => {
    this.setState(({isVisible: wasVisible}) => {
      return {
        isVisible: !wasVisible
      };
    });
  };

  render() {
    const visibiltyToggledStyle = this.state.isVisible ? {} : {
      display: 'none'
    };

    return (
      <div className="index">
        <div className="header">
          WindowedList
        </div>

        <div className="examples">
          <div className="example axis-y">
            <strong>
              Props
            </strong>

            <pre className="props">
              {JSON.stringify(hiddenProps, null, 2)}
            </pre>

            <strong>
              Component
            </strong>

            <div>
              <button
                className="button"
                onClick={this.onClickToggleIsVisible}
                type="button"
              >
                Toggle visibility
              </button>
            </div>

            <div
              className="component"
              style={visibiltyToggledStyle}
            >
              <WindowedList
                {...hiddenProps}
              />
            </div>
          </div>

          {examples.map((props, index) => {
            const key = `example-${index}`;

            return (
              <div
                className={`example axis-${props.axis}`}
                key={key}
              >
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
  }
}

export default Example;
