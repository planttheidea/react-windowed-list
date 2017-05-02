# react-windowed-list CHANGELOG

### 1.2.1
* Fix jitter issue when an alternative key is used for list items when type is `variable`

### 1.2.0
* Make lazy loading opt-in via `isLazy` prop

### 1.1.0
* Add `debounceReconciler` prop to allow ability to debounce post-update reconciliations for certain edge cases

### 1.0.1
* Fix check of `itemSize` in `getFromAndSizeFromListItemSize` to check if it is undefined instead of just falsy
* Fix Component name to not include `Measured()` wrapper created by `remeasure`

### 1.0.0
* Initial release
