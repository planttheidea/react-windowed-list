# react-windowed-list CHANGELOG

## 3.0.1

* Fix glaring README issue

## 3.0.0

* Complete refactor under-the-hood to leverage `react-parm`
* Uses new lifecycle methods available in React 16.3, falling back to the pre-existing unsafe lifecycle methods
* Uses `rollup` for `dist` builds instead of `webpack` for smaller filesize
* No longer uses `PureComponent` for maximum performance and use-case coverage

#### BREAKING CHANGES

* `itemSizeEstimator` prop is now `getEstimatedItemSize`
* `itemSizeGetter` prop is now `getItemSize`
* `scrollParentGetter` prop is now `getScrollParent`

## 2.0.0

* Remove `lodash` and `moize` dependencies (smaller footprint)
* Update to latest version of`remeasure`
* Prevent permanent locking of unstable state

#### BREAKING CHANGES

* CommonJS imports now need to specify `.default`, e.g. `require('remeasure').default`

## 1.5.7

* Move `react` and `react-dom` to `peerDependencies`

## 1.5.6

* Add `react` 16 support

## 1.5.5

* Remove unneeded variable instantiation for faster runtime

## 1.5.4

* Update dependencies (`moize` and `remeasure` had big performance improvements)

## 1.5.3

* Under-the-hood optimizations

## 1.5.2

* Fix issue where unbound containers were not growing to the right size when `rowSizing` was set to `variable`

## 1.5.1

* Give `initialIndex` a default value of `0` instead of being left `undefined`

## 1.5.0

* Add memoization of container's calculated style for better performance
  * `moize` is now an external, so if using the `dist` version then it is expected to exist on the `window` from a prior `<script>` tag
* Remove some unneeded code
* More defensive coding around scroll listeners

## 1.4.2

* Prevent cyclical render when total calculated list size is 0 (because it is hidden)
* Prevent adding of scroll listeners when the `scrollParent` does not exist

## 1.4.1

* Remove a bunch of runtime calls to `findDOMNode`
* Add defensive code to prevent execution when the component is not mounted

## 1.4.0

* Add `minSize` prop to allow setting minimum number of rendered items

## 1.3.0

* Add `isHidden` prop to handle when the container is hidden or not

## 1.2.1

* Fix jitter issue when an alternative key is used for list items when type is `variable`

## 1.2.0

* Make lazy loading opt-in via `isLazy` prop

## 1.1.0

* Add `debounceReconciler` prop to allow ability to debounce post-update reconciliations for certain edge cases

## 1.0.1

* Fix check of `itemSize` in `getFromAndSizeFromListItemSize` to check if it is undefined instead of just falsy
* Fix Component name to not include `Measured()` wrapper created by `remeasure`

## 1.0.0

* Initial release
