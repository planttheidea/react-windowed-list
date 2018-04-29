# react-windowed-list

A fast, versatile virtual-render list component for React.

This component was originally forked from [`ReactList`](https://github.com/orgsync/react-list), so credit for the core functionality goes to [orgsync](https://github.com/orgsync). I have re-architected it to be more modular, fixed some of the rendering issues, added additional options, and added code coverage.

If you are migrating from `ReactList`, the following props have changed names:

* `itemsRenderer` => `containerRenderer`
* `itemSizeEstimator` => `getEstimatedItemSize`
* `itemSizeGetter` => `getItemSize`
* `scrollParentGetter` => `getScrollParent`

* [Usage](#usage)
* [Available props](#available-props)
  * [axis](#axis)
  * [containerRenderer](#containerrenderer)
  * [debounceReconciler](#debouncereconciler)
  * [getEstimatedItemSize](#getestimateditemsize)
  * [getItemSize](#getitemsize)
  * [getScrollParent](#getscrollparent)
  * [initialIndex](#initialindex)
  * [isHidden](#ishidden)
  * [isLazy](#islazy)
  * [itemRenderer](#itemrenderer)
  * [length](#length)
  * [minSize](#minsize)
  * [pageSize](#pageSize)
  * [threshold](#threshold)
  * [type](#type)
  * [usePosition](#useposition)
  * [useTranslate3d](#usetranslate3d)
* [Instance methods](#instance-methods)
  * [getVisibleRange](#getvisiblerange)
  * [scrollAround](#scrollaround)
  * [scrollTo](#scrollto)
* [FAQ](#faq)
* [Development](#development)

## Usage

```javascript
import React, { PureComponent } from "react";
import WindowedList from "react-windowed-list";

const CONTAINER_STYLE = {
  height: 500,
  overflow: "auto"
};

class MyComponent extends PureComponent {
  renderItem = (index, key) => {
    return (
      <div key={key}>I am rendering stuff for the item at index {index}!</div>
    );
  };

  render() {
    const { items } = this.props;

    return (
      <div>
        <h1>List example</h1>

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

The version you install from `npm` includes both the library as you would use in a bundler (such as `webpack`) as well as the compiled file you would use in a `<script>` tag or with AMD bundlers (such as `RequireJS`). If using the `dist` file, be aware that the following dependencies are considered externals, meaning they are required to exist on the `window` before the library can be included:

* [`react`](https://www.npmjs.com/package/react)
* [`react-dom`](https://www.npmjs.com/package/react-dom)
* [`remeasure`](https://www.npmjs.com/package/remeasure)

## Available props

#### axis

_defaults to `y`_

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

      <tbody>{items}</tbody>
    </table>
  );
};
```

#### debounceReconciler

The number in milliseconds to debounce the reconciliation call to the frame update.

Internally, `updateFrame` is called upon all scroll actions, and upon component update an additional reconciliation call to it is performed to ensure that the frame is at the correct scroll location. While extremely rare, there are edge cases where the eagerness of this reconciliation may cause a render loop. Applying a `debounceReconciler` should ensure that a stable state is reached before attempting reconciliation. This is not usually necessary, and has potential performance ramifications, so only apply as needed.

#### getEstimatedItemSize

A function that should return the estimated size for the element. It receives both the `index` of the element and the internal `cache` of existing elements as parameters.

**NOTE**: This method is only called if no other technique to determine the item size is possible (including through the DOM).

#### getItemSize

A function that should return the size of the element. It receives the `index` of the element as the only parameter.

#### getScrollParent

_defaults to finding the nearest scrollable container_

A function that returns a DOM element or `window` that will be treated as the scrolling container for the list. In most cases, this does not need to be set for the list to work as intended. It is exposed as a prop for more complicated uses where the scrolling container may not initially have an overflow property that enables scrolling, or if you want to specify a container higher up in the DOM tree.

#### initialIndex

The index to scroll to after mounting.

#### isHidden

If the element is hidden via CSS and the `type` is not `uniform`, `WindowList` will try to render all the elements because it calculates the size of all of the items as `0`. Setting `isHidden` to `true` when the element is hidden will prevent this behavior.

#### isLazy

Enables lazier loading of list items within the view container. This can improve performance, but can also produce unwanted visual side effects (such as not enough list items rendering), so use at your discretion.

#### itemRenderer

A function that receives `index` and `key` and returns the content to be rendered for the item at that index.

```javascript
renderItem = (index, key) => {
  const { items } = this.props;

  return <div key={key}>{items[index]}</div>;
};
```

It is also possible to use your own custom `key` property

```javascript
renderItem = index => {
  const { items } = this.props;

  return <div key={items[index].id}>{items[index]}</div>;
};
```

`key` is required, so please ensure the value you pass is not empty and is unique.

#### length

_defaults to `0`_

The number of items in the list.

#### minSize

_defaults to `1`_

The minimum number of items to render in the list at any given time.

#### pageSize

_defaults to `10`_

The number of items to batch up for new renders.

#### threshold

_defaults to `100`_

The number of pixels to buffer at the beginning and end of the rendered list items.

#### type

_one of: `simple`, `variable`, `uniform`, defaults to `simple`_

* `simple`
  * Does not cache item sizes or remove items that are above the viewport
  * This type can be sufficient for many cases when the only requirement is incremental rendering when scrolling
* `variable`
  * Caches item sizes as they are rendered so that the items that are above the viewport can be removed as the list is scrolled
  * This type is preferred when the sizes of the items in the list vary
  * Supply the `itemSizeGetter` when possible so the entire length of the list can be established beforehand
* `uniform`
  * The size of the first item will be used as the size for all other items
  * This type is preferred when you can guarantee all of your elements will be the same size, which allows the length of the entire list to be calculated beforehand
  * Multiple items per row are also supported with this type

**NOTE**: If you have set the `type` to be `uniform` and the sizes of the items vary, it causes continuous re-calculation of sizes until the list gives up. If you received a message about WindowedList reaching an unstable state, this is likely the cause.

#### usePosition

_defaults to `false`_

Set to `true` if you choose to not use `transform` CSS property, instead opting for one based on `position`. This is a rare use case, but an example is if you have nested elements that have `position: fixed` and transform is disturbing their window-based position.

**NOTE**: This is a performance decrease, so only apply it if you really need it.

#### useTranslate3d

Set to `true` if you want to use `translate3d` instead of the default `translate` value for the `transform` property. This can be more performant (especially on mobile devices), but is supported by fewer browsers.

## Instance methods

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

## FAQ

* What is _"WindowedList failed to reach a stable state."_?
  * This happens when specifying the `uniform` type when the elements are not actually uniform in size. The component attempts to draw only the minimum necessary elements at one time and that minimum element calculation is based off of the first element in the list. When the first element does not match the other elements, the calculation will be wrong and the component will never be able to fully resolve the ideal necessary elements.
* Why doesn't it work with margins?
  * The calculations to figure out element positioning and size get significantly more complicated with margins, so they are not supported. Use a transparent `border`, `padding`, or an element with nested elements to achieve the desired spacing.
* Why is there no `onScroll` event handler?
  * If you need an `onScroll` handler, just add the handler to the container element wrapping the `WindowedList` component.
* Why does `WindowList` render all the items when the container is hidden by CSS?
  * The size of each item is calculated to be `0` as it is hidden, so it tries to fill the container infinitely (or until the list is complete). If you want to prevent this behavior, set `isHidden` to `true` when the container is hidden.

## Development

Standard stuff, clone the repo and `npm i` to get the dependencies. npm scripts available:

* `build` => builds the distributed JS with `NODE_ENV=development` and with sourcemaps
* `build:minified` => builds the distributed JS with `NODE_ENV=production` and minified
* `dev` => runs the webpack dev server for the playground
* `dist` => runs the `build` and `build:minified`
* `lint` => runs ESLint against files in the `src` folder
* `lint:fix` => runs ESLint against files in the `src` folder and fixes any fixable issues discovered
* `prepublish` => if in publish, runs `prepublish:compile`
* `prepublish:compile` => runs the `lint`, `test`, `transpile:lib`, `transpile:es`, and `dist` scripts
* `test` => run `ava` with NODE_ENV=test
* `test:coverage` => run `ava` with `nyc` to calculate code coverage
* `test:watch` => runs `test` but with persistent watcher
* `transpile:lib` => run babel against all files in `src` to create files in `lib`
* `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for
