import React, {PureComponent} from 'react';
import WindowedList from '../src';
import uuid from 'uuid/v4';

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
  return 30 + 10 * (index % 10);
};

getHeight.toJSON = () => {
  return getHeight.toString();
};

const getWidth = (index) => {
  return 100 + 10 * (index % 10);
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
    return renderSquareItem(column + 10000 * row, key);
  };

  return (
    /* eslint-disable prettier */
    <WindowedList
      axis="x"
      itemRenderer={gridLineItemRenderer}
      key={key}
      length={10000}
      type="uniform"
    />
    /* eslint-enable */
  );
};

renderGridLine.toJSON = () => {
  return renderGridLine.toString();
};

const differentKeyItems = new Array(10000).fill('foo').map(() => {
  return {
    id: uuid(),
    height: 100 + Math.floor(Math.random() * 100)
  };
});

const differentKeyRenderer = (index) => {
  const item = differentKeyItems[index];
  const style = {
    height: item.height
  };

  return (
    <div
      className={`item${index % 2 ? '' : ' even'}`}
      key={item.id}
      style={style}
    >
      {index}
    </div>
  );
};

differentKeyRenderer.toJSON = () => {
  return differentKeyRenderer.toString();
};

const examples = [
  {
    debounceReconciler: 1000,
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
    threshold: 250,
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
    itemRenderer: differentKeyRenderer,
    threshold: 400,
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
  },
  {
    containerRenderer(items, ref) {
      return (
        <table>
          <thead>
            <tr>
              <th>Header</th>
            </tr>
          </thead>

          <tbody ref={ref}>{items}</tbody>
        </table>
      );
    },
    length: 10000,
    itemRenderer(index, key) {
      return (
        <tr key={key}>
          <td>{index}</td>
        </tr>
      );
    },
    type: 'uniform',
    usePosition: true
  }
];

const hiddenProps = {
  length: 10000,
  itemRenderer: renderItem,
  type: 'variable'
};

class Example extends PureComponent {
  state = {
    isRendered: false,
    isVisible: false
  };

  onClickToggleIsRendered = () => {
    this.setState(({isRendered: wasRendered}) => {
      return {
        isRendered: !wasRendered
      };
    });
  };

  onClickToggleIsVisible = () => {
    this.setState(({isVisible: wasVisible}) => {
      return {
        isVisible: !wasVisible
      };
    });
  };

  setRef = (element) => {
    this.ref = element;
  };

  getRefVisibleRange = () => {
    console.log(this.ref.getVisibleRange());
  };

  setScroll = () => {
    this.ref.scrollTo(50);
  };

  render() {
    const {isRendered, isVisible} = this.state;

    const visibiltyToggledStyle = isVisible
      ? {}
      : {
        display: 'none'
      };

    const hiddenPropsWithVisibility = {
      ...hiddenProps,
      isHidden: !isVisible
    };

    return (
      <div className="index">
        <div className="header">WindowedList</div>

        <button onClick={this.getRefVisibleRange}>Log visible range of ref</button>
        <button onClick={this.setScroll}>Scroll ref to 50</button>

        <div className="examples">
          <div className="example axis-y">
            <strong>Props</strong>

            <pre className="props">{JSON.stringify(hiddenPropsWithVisibility, null, 2)}</pre>

            <strong>Component</strong>

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
                {...hiddenPropsWithVisibility}
                ref={this.setRef}
              />
            </div>
          </div>

          <div className="example axis-y">
            <strong>Props</strong>

            <pre className="props">{JSON.stringify(hiddenProps, null, 2)}</pre>

            <strong>Component</strong>

            <div>
              <button
                className="button"
                onClick={this.onClickToggleIsRendered}
                type="button"
              >
                Toggle rendered
              </button>
            </div>

            {isRendered && (
              <div className="component">
                <WindowedList
                  {...hiddenProps}
                  isVisible
                />
              </div>
            )}
          </div>

          {examples.map((props, index) => {
            const key = `example-${index}`;

            return (
              <div
                className={`example axis-${props.axis}`}
                key={key}
              >
                <strong>Props</strong>

                <pre className="props">{JSON.stringify(props, null, 2)}</pre>

                <strong>Component</strong>

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
