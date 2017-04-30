# react-windowed-list

A fast, versatile virtual-render list component for React.

This component was originally forked from [ReactList](https://github.com/orgsync/react-list), so credit for the core functionality all goes to [orgsync](https://github.com/orgsync). I have re-architected it to be more modular, fixed some of the rendering issues, added additional options, and added code coverage.

If you are migrating from `ReactList`, the only prop that has changed is `itemsRenderer`, which has been renamed to `containerRenderer`.

### Table of contents
* [Installation](#installation)
* [Usage](#usage)
* [Available props](#available-props)
  * [axis](#axis)
  * [containerRenderer](#containerrenderer)
  * [initialIndex](#initialindex)
  * [itemRenderer](#itemrenderer)
  * [length](#length)
  * [pageSize](#pageSize)
  * [scrollParentGetter](#scrollparentgetter)
  * [threshold](#threshold)
  * [type](#type)
  * [usePosition](#useposition)
  * [useTranslate3d](#usetranslate3d)
* [Methods](#methods)
  * [getVisibleRange](#getvisiblerange)
  * [scrollAround](#scrollaround)
  * [scrollTo](#scrollto)
* [FAQ](#faq)
* [Development](#development)

### Installation

```
$ npm i react-windowed-list --save
```

### Usage

```javascript
import React, {
  PureComponent
} from 'react';
import WindowedList from 'react-windowed-list';

const CONTAINER_STYLE = {
  height: 500,
  overflow: 'auto'
};

class MyComponent extends PureComponent {
  renderItem = (index, key) => {
    return (
      <div key={key}>
        I am rendering stuff for the item at index {index}!
      </div>
    );
  };

  render() {
    const {
      items
    } = this.props;

    return (
      <div>
        <h1>
          List example
        </h1>

        <div style={CONTAINER_STYLE}>
          <WindowedList
            itemRenderer={this.renderItem}
            length={items.length}
            type="uniform"
          />
        </div>
      </div>
    );
  }
}
```

### Available props

#### axis

*defaults to `y`*

The axis that this list will scroll on.

#### containerRenderer

A function that receives the rendered list items and a ref. By default, this element is just a `<div>`, and generally it only needs to be overridden for use in a `<table>` or other special case.

**NOTE**: You must set `ref={ref}` on the component that contains the items so that the correct item sizing calculations can be made.

```javascript
renderContainer = (items, ref) => {
  return (
    <table ref={ref}>
      <thead>
        <th>Item 1</th>
        <th>Item 2</th>
        <th>Item 3</th>
      </thead>

      <tbody>
        {items}
      </tbody>
    </table>
  );
};
```

#### initialIndex

The index to scroll to after mounting.

#### itemRenderer

A function that receives `index` and `key` and returns the content to be rendered for the item at that index.

```javascript
renderItem = (index, key) => {
  const {
    items
  } = this.props;

  return (
    <div key={key}>
      {this.props[index]}
    </div>
  );
};
```

#### length

*defaults to `0`*

The number of items in the list.

#### pageSize

*defaults to `10`*

The number of items to batch up for new renders.

#### scrollParentGetter

*defaults to finding the nearest scrollable container*

A function that returns a DOM element or `window` that will be treated as the scrolling container for the list. In most cases, this does not need to be set for the list to work as intended. It is exposed as a prop for more complicated uses where the scrolling container may not initially have an overflow property that enables scrolling.

#### threshold

*defaults to `100`*

The number of pixels to buffer at the beginning and end of the rendered list items.

#### type

*one of: `simple`, `variable`, `uniform`, defaults to `simple`*

* `simple`
  * Does not cache item sizes or remove items that are above the viewport
  * This type is sufficient for many cases when the only requrement is incremental rendering when scrolling
* `variable`
  * Caches item sizes as they are rendered so that the items that are above the viewport can be removed as the list is scrolled
  * This type is preferred when the sizes of the items in the list vary
  * Supply the `itemSizeGetter` when possible so the entire length of the list can be established beforehand
* `uniform`
  * The size of the first item will be used as the size for all other items
  * This type is preferred when you can guarantee all of your elements will be the same size, which allows the length of the entire list to be calculated beforehand
  * Multiple items per row are also supported with this type

**NOTE**: If you have set the `type` to be `uniform` and the sizes of the items vary, it causes a continuous re-render until the list gives up. If you received a message about WindowedList reaching an unstable state, this is a common cause.

#### usePosition

*defaults to `false`*

Set to `true` if you choose to not use `transform` CSS property, instead opting for one based on `position`. This is a rare use case, but an example is if you have nested elements that have `position: fixed` and transform is disturbing their window-based position.

**NOTE**: This is a performance decrease, so only apply it if you really need it.

#### useTranslate3d

Set to `true` if you want to use `translate3d` instead of the default `translate` value for the `transform` property. This can be helpful on mobile devices, but is supported by fewer browsers.

### Methods

#### getVisibleRange

Return the indices of the first and last items that are at all visible in the viewport.

```javascript
class MyComponent extends PureComponent {
  list = null;

  renderItem = () => {
    ...
  };

  setListRef = (component) => {
    this.list = component;
  };

  render() {
    console.log(this.list.getVisibleRange());

    return (
      <div>
        <WindowedList
          itemRenderer={this.renderItem}
          length={this.props.items.length}
          ref={this.setListRef}
        />
      </div>
    );
  }
}
```

#### scrollAround

Put the element at `index` within the viewport. This is similar to `scrollTo`, but only scroll until the item is visible, not necessarily at the top of the viewport.

**NOTE**: If you are not using `type="uniform"` or an `itemSizeGetter`, you will only be able to scroll to an element that has already been rendered.

```javascript
class MyComponent extends PureComponent {
  list = null;

  renderItem = () => {
    ...
  };

  setListRef = (component) => {
    this.list = component;
  };

  triggerScrollToMiddle = () => {
    this.list.scrollAround(Math.floor(this.props.items.length / 2));
  };

  render() {
    return (
      <div>
        <WindowedList
          itemRenderer={this.renderItem}
          length={this.props.items.length}
          ref={this.setListRef}
        />
      </div>
    );
  }
}
```

#### scrollTo

Put the element at `index` at the top of the viewport.

**NOTE**: If you are not using `type="uniform"` or an `itemSizeGetter`, you will only be able to scroll to an element that has already been rendered.

```javascript
class MyComponent extends PureComponent {
  list = null;

  renderItem = () => {
    ...
  };

  setListRef = (component) => {
    this.list = component;
  };

  triggerScrollToTop = () => {
    this.list.scrollTo(0);
  };

  render() {
    return (
      <div>
        <WindowedList
          itemRenderer={this.renderItem}
          length={this.props.items.length}
          ref={this.setListRef}
        />
      </div>
    );
  }
}
```

### FAQ

* What is "WindowedList failed to reach a stable state."?
  * This happens when specifying the `uniform` type when the elements are not actually uniform in size. The component attempts to draw only the minimum necessary elements at one time and that minimum element calculation is based off of the first element in the list. When the first element does not match the other elements, the calculation will be wrong and the component will never be able to fully resolve the ideal necessary elements.
* Why doesn't it work with margins?
  * The calculations to figure out element positioning and size get significantly more complicated with margins, so they are not supported. Use a transparent border, padding, or an element with nested elements to achieve the desired spacing.
* Why is there no `onScroll` event handler?
  * If you need an `onScroll` handler, just add the handler to the container element wrapping the `WindowedList` component.

### Development

  Standard stuff, clone the repo and `npm i` to get the dependencies. npm scripts available:
  * `build` => builds the distributed JS with `NODE_ENV=development` and with sourcemaps
  * `build:minified` => builds the distributed JS with `NODE_ENV=production` and minified
  * `dev` => runs the webpack dev server for the playground
  * `dist` => runs the `build` and `build:minified`
  * `lint` => runs ESLint against files in the `src` folder
  * `lint:fix` => runs ESLint against files in the `src` folder and fixes any fixable issues discovered
  * `prepublish` => if in publish, runs `prepublish:compile`
  * `prepublish:compile` => runs the `lint`, `test`, `transpile`, `dist` scripts
  * `test` => run `ava` with NODE_ENV=test
  * `test:coverage` => run `ava` with `nyc` to calculate code coverage
  * `test:watch` => runs `test` but with persistent watcher
  * `transpile` => runs Babel against files in `src` to files in `lib`
