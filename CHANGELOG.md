# frontend-mow-registry

## 2.12.0

### Minor Changes

- [#363](https://github.com/lblod/frontend-mow-registry/pull/363) [`60d742f3e1679ed849a6e72b1a5a27739e573132`](https://github.com/lblod/frontend-mow-registry/commit/60d742f3e1679ed849a6e72b1a5a27739e573132) Thanks [@elpoelma](https://github.com/elpoelma)! - Ensure road-signal labels in measure are clickable/resolvable

## 2.11.1

### Patch Changes

- [#358](https://github.com/lblod/frontend-mow-registry/pull/358) [`4f15978a04528bfd15b4b288c282540dd944b4d7`](https://github.com/lblod/frontend-mow-registry/commit/4f15978a04528bfd15b4b288c282540dd944b4d7) Thanks [@elpoelma](https://github.com/elpoelma)! - Move necessary URIs to new `http://register.mobiliteit.vlaanderen.be/` base

## 2.11.0

### Minor Changes

- [#361](https://github.com/lblod/frontend-mow-registry/pull/361) [`9446852dbb62ebf753db300b225ebc07cfbf9f40`](https://github.com/lblod/frontend-mow-registry/commit/9446852dbb62ebf753db300b225ebc07cfbf9f40) Thanks [@piemonkey](https://github.com/piemonkey)! - Update traffic signal manual queries to use schema.org predicates for validity instead of ext.

- [#361](https://github.com/lblod/frontend-mow-registry/pull/361) [`2c579dffedab53501c9dd1302e305dac2d0b171e`](https://github.com/lblod/frontend-mow-registry/commit/2c579dffedab53501c9dd1302e305dac2d0b171e) Thanks [@piemonkey](https://github.com/piemonkey)! - Remove zonality from road-marking-concepts and traffic-light-concepts

## 2.10.1

### Patch Changes

- [#362](https://github.com/lblod/frontend-mow-registry/pull/362) [`8fa79314b776a45398c2d32a02b05b4e7d9a4bda`](https://github.com/lblod/frontend-mow-registry/commit/8fa79314b776a45398c2d32a02b05b4e7d9a4bda) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix issue where instruction variable template was not shown in power-select

## 2.10.0

### Minor Changes

- [#356](https://github.com/lblod/frontend-mow-registry/pull/356) [`6285c0990109dba743d8ecb32afb1dd999674cd2`](https://github.com/lblod/frontend-mow-registry/commit/6285c0990109dba743d8ecb32afb1dd999674cd2) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Add Regulatory notation to all the traffic signs

- [#356](https://github.com/lblod/frontend-mow-registry/pull/356) [`19b176835fccd13196072fa551a1846c3928c849`](https://github.com/lblod/frontend-mow-registry/commit/19b176835fccd13196072fa551a1846c3928c849) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Add Regulatory notation to all the traffic signs

### Patch Changes

- [#359](https://github.com/lblod/frontend-mow-registry/pull/359) [`f56751be26a95204b6f8510ea374407e698c257e`](https://github.com/lblod/frontend-mow-registry/commit/f56751be26a95204b6f8510ea374407e698c257e) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix `ember-metis` `getOwner` import. This resolves the issue where showcasing information about external URIs was not possible.

- [#360](https://github.com/lblod/frontend-mow-registry/pull/360) [`7a8ca13624f55e2df0d3f041fa25770b739f152f`](https://github.com/lblod/frontend-mow-registry/commit/7a8ca13624f55e2df0d3f041fa25770b739f152f) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix issue where it was not possible to remove the default value of a number variable

## 2.9.0

### Minor Changes

- [#346](https://github.com/lblod/frontend-mow-registry/pull/346) [`c7a4dc6e29a5d79960c82b67dddac7ab722a98be`](https://github.com/lblod/frontend-mow-registry/commit/c7a4dc6e29a5d79960c82b67dddac7ab722a98be) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Variable and shape rework

- [#349](https://github.com/lblod/frontend-mow-registry/pull/349) [`bf369fae88c3cd44ee80eb132ad029b86c5aa0b5`](https://github.com/lblod/frontend-mow-registry/commit/bf369fae88c3cd44ee80eb132ad029b86c5aa0b5) Thanks [@elpoelma](https://github.com/elpoelma)! - Add support for selecting default values for sign variables

- [#355](https://github.com/lblod/frontend-mow-registry/pull/355) [`0d405e818a3050c99b0d531b97dfd2064a1ac965`](https://github.com/lblod/frontend-mow-registry/commit/0d405e818a3050c99b0d531b97dfd2064a1ac965) Thanks [@elpoelma](https://github.com/elpoelma)! - Removal of obsolete ember-data models:
  - `resource` (`rdfs:Resource`)
  - `concept` (`ext:Concept`)
  - `shape` (`sh:Shape`)
  - `property-shape` (`sh:PropertyShape`)
  - `node-shape` (`sh:NodeShape`)

- [#355](https://github.com/lblod/frontend-mow-registry/pull/355) [`25ff8df7bdfd2d7a6698fcebba128d816820e46d`](https://github.com/lblod/frontend-mow-registry/commit/25ff8df7bdfd2d7a6698fcebba128d816820e46d) Thanks [@elpoelma](https://github.com/elpoelma)! - Remove `skos-concept` superclass from `traffic-signal-concept` model

- [#339](https://github.com/lblod/frontend-mow-registry/pull/339) [`e021df85709f9ee7c57b08c4885235018659560d`](https://github.com/lblod/frontend-mow-registry/commit/e021df85709f9ee7c57b08c4885235018659560d) Thanks [@elpoelma](https://github.com/elpoelma)! - Remove `ember-data` dependency and introduce warp-drive

- [#352](https://github.com/lblod/frontend-mow-registry/pull/352) [`39058309e2fe54cd2ef50eb6cfa42e10aaf18d81`](https://github.com/lblod/frontend-mow-registry/commit/39058309e2fe54cd2ef50eb6cfa42e10aaf18d81) Thanks [@elpoelma](https://github.com/elpoelma)! - Set-up a patched version of `ember-metis` (https://github.com/redpencilio/ember-metis)
  `ember-metis` allows this application to display information about public resources created using the application.

- [#354](https://github.com/lblod/frontend-mow-registry/pull/354) [`c67c3b002ef70e3f135a9697767d3841cb5cbd43`](https://github.com/lblod/frontend-mow-registry/commit/c67c3b002ef70e3f135a9697767d3841cb5cbd43) Thanks [@piemonkey](https://github.com/piemonkey)! - Add page to road sign view to manage which signals can be contained within signs

### Patch Changes

- [#347](https://github.com/lblod/frontend-mow-registry/pull/347) [`abca19d3823b1f0a74b22618a40c1b7ef908a670`](https://github.com/lblod/frontend-mow-registry/commit/abca19d3823b1f0a74b22618a40c1b7ef908a670) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `ember-concurrency` to version 4.0.6

- [#347](https://github.com/lblod/frontend-mow-registry/pull/347) [`3643b53d6efaf6fe119152941f7c846d1eb34ff8`](https://github.com/lblod/frontend-mow-registry/commit/3643b53d6efaf6fe119152941f7c846d1eb34ff8) Thanks [@elpoelma](https://github.com/elpoelma)! - Introduce `@warp-drive/ember` dependency, containing support for the `getPromiseState` helper

- [#351](https://github.com/lblod/frontend-mow-registry/pull/351) [`c35e69d2d3d7ca0f67ed9160d332ccef1399bbb3`](https://github.com/lblod/frontend-mow-registry/commit/c35e69d2d3d7ca0f67ed9160d332ccef1399bbb3) Thanks [@piemonkey](https://github.com/piemonkey)! - Fix bug with display of codelist instruction variables

- [#348](https://github.com/lblod/frontend-mow-registry/pull/348) [`dd64ff78f6aca9ddaa308093ae23dbfcee3b602d`](https://github.com/lblod/frontend-mow-registry/commit/dd64ff78f6aca9ddaa308093ae23dbfcee3b602d) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Add checkerboard pattern to icons to improve visibility

- [#353](https://github.com/lblod/frontend-mow-registry/pull/353) [`8cbfed5e65f8383d9de47eb3f7b4de2147bbaf3c`](https://github.com/lblod/frontend-mow-registry/commit/8cbfed5e65f8383d9de47eb3f7b4de2147bbaf3c) Thanks [@lagartoverde](https://github.com/lagartoverde)! - convert all relationships to kebab case

- [#350](https://github.com/lblod/frontend-mow-registry/pull/350) [`ba73a6abde451a363b2889c12e2adea834aab48a`](https://github.com/lblod/frontend-mow-registry/commit/ba73a6abde451a363b2889c12e2adea834aab48a) Thanks [@elpoelma](https://github.com/elpoelma)! - Cascade delete traffic-signal-list-items when deleting connected traffic-signal-concept

- [#352](https://github.com/lblod/frontend-mow-registry/pull/352) [`78b79b35e632216c5b580cecdcbc7f122b9f5d6c`](https://github.com/lblod/frontend-mow-registry/commit/78b79b35e632216c5b580cecdcbc7f122b9f5d6c) Thanks [@elpoelma](https://github.com/elpoelma)! - Drop `ember-fetch` dependency. `ember-fetch` has been marked as deprecated, and we can use native `fetch` without issues

- [#347](https://github.com/lblod/frontend-mow-registry/pull/347) [`3643b53d6efaf6fe119152941f7c846d1eb34ff8`](https://github.com/lblod/frontend-mow-registry/commit/3643b53d6efaf6fe119152941f7c846d1eb34ff8) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `ember-power-select` to version 8.8.0

- [#357](https://github.com/lblod/frontend-mow-registry/pull/357) [`fcbf5c9d0435708bbe8d1fedcf49cf3be280e24c`](https://github.com/lblod/frontend-mow-registry/commit/fcbf5c9d0435708bbe8d1fedcf49cf3be280e24c) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Remove leftover code from traffic sign forms and improve shapes screen performance

- [#341](https://github.com/lblod/frontend-mow-registry/pull/341) [`76d6d2aaa1e791875044e9b66a4b690eed528c1b`](https://github.com/lblod/frontend-mow-registry/commit/76d6d2aaa1e791875044e9b66a4b690eed528c1b) Thanks [@elpoelma](https://github.com/elpoelma)! - Introduce usage of new `store.request` Warpdrive API, and migrate instances of: `findAll`, `findRecord`, `query` and `.save()` to the new syntax.

## 2.8.0

### Minor Changes

- [#345](https://github.com/lblod/frontend-mow-registry/pull/345) [`79671dba548e1b58ab18971d15ab32c4c8ee869d`](https://github.com/lblod/frontend-mow-registry/commit/79671dba548e1b58ab18971d15ab32c4c8ee869d) Thanks [@piemonkey](https://github.com/piemonkey)! - Move codelist values to new model with support for recording the position of the value in the codelist and sort values by this position in the UI

## 2.7.0

### Minor Changes

- [#340](https://github.com/lblod/frontend-mow-registry/pull/340) [`9ec48a3a6f14cf51aacba06f34b4051ae0e5de0c`](https://github.com/lblod/frontend-mow-registry/commit/9ec48a3a6f14cf51aacba06f34b4051ae0e5de0c) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Make shapes not required anymore on signs

### Patch Changes

- [#343](https://github.com/lblod/frontend-mow-registry/pull/343) [`600aabacd645961f1e2724db689522847615dc19`](https://github.com/lblod/frontend-mow-registry/commit/600aabacd645961f1e2724db689522847615dc19) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Add variable signage to filters and details in measures

## 2.6.0

### Minor Changes

- [#337](https://github.com/lblod/frontend-mow-registry/pull/337) [`d632a5b589b285298177f438abe4d69572836878`](https://github.com/lblod/frontend-mow-registry/commit/d632a5b589b285298177f438abe4d69572836878) Thanks [@piemonkey](https://github.com/piemonkey)! - Rename super-class of road signs, road markings and traffic lights to 'traffic signal' to more closely match the original Dutch 'verkeersteken'

- [#332](https://github.com/lblod/frontend-mow-registry/pull/332) [`357bafe7462755a71cf77e351a736f68ddda53c1`](https://github.com/lblod/frontend-mow-registry/commit/357bafe7462755a71cf77e351a736f68ddda53c1) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Add zonality selector to roadsign form

- [#338](https://github.com/lblod/frontend-mow-registry/pull/338) [`36a5c6f02c96373a3bde9241a77932145c95633d`](https://github.com/lblod/frontend-mow-registry/commit/36a5c6f02c96373a3bde9241a77932145c95633d) Thanks [@piemonkey](https://github.com/piemonkey)! - Add validation to instruction creation/edit page

### Patch Changes

- [#334](https://github.com/lblod/frontend-mow-registry/pull/334) [`2b00641181a756db7141a95300670cb189a6497d`](https://github.com/lblod/frontend-mow-registry/commit/2b00641181a756db7141a95300670cb189a6497d) Thanks [@elpoelma](https://github.com/elpoelma)! - Move to pnpm

- [#333](https://github.com/lblod/frontend-mow-registry/pull/333) [`53723221482db0b1563fc4e06b67c34db7193fd6`](https://github.com/lblod/frontend-mow-registry/commit/53723221482db0b1563fc4e06b67c34db7193fd6) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `ember-data` and related packages to version 5.5.0

- [#336](https://github.com/lblod/frontend-mow-registry/pull/336) [`28e1d4e379e5f010e7c08163a7b67f93b878bda8`](https://github.com/lblod/frontend-mow-registry/commit/28e1d4e379e5f010e7c08163a7b67f93b878bda8) Thanks [@piemonkey](https://github.com/piemonkey)! - Add adapter to handle type-checked 'includes' when querying resources

- [#335](https://github.com/lblod/frontend-mow-registry/pull/335) [`7d1aa0e9b99e09efa0f6b36e4c225478e80f2c80`](https://github.com/lblod/frontend-mow-registry/commit/7d1aa0e9b99e09efa0f6b36e4c225478e80f2c80) Thanks [@piemonkey](https://github.com/piemonkey)! - Move to glint for typechecking

- [#333](https://github.com/lblod/frontend-mow-registry/pull/333) [`53723221482db0b1563fc4e06b67c34db7193fd6`](https://github.com/lblod/frontend-mow-registry/commit/53723221482db0b1563fc4e06b67c34db7193fd6) Thanks [@elpoelma](https://github.com/elpoelma)! - Update to `ember-resources` 7.0.6 and add `reactiveweb` dependency

- [#333](https://github.com/lblod/frontend-mow-registry/pull/333) [`53723221482db0b1563fc4e06b67c34db7193fd6`](https://github.com/lblod/frontend-mow-registry/commit/53723221482db0b1563fc4e06b67c34db7193fd6) Thanks [@elpoelma](https://github.com/elpoelma)! - Add `ember-data-table` dependency

- [#333](https://github.com/lblod/frontend-mow-registry/pull/333) [`53723221482db0b1563fc4e06b67c34db7193fd6`](https://github.com/lblod/frontend-mow-registry/commit/53723221482db0b1563fc4e06b67c34db7193fd6) Thanks [@elpoelma](https://github.com/elpoelma)! - Set minimum node version to 20

## 2.5.0

### Minor Changes

- [#331](https://github.com/lblod/frontend-mow-registry/pull/331) [`4b047d8`](https://github.com/lblod/frontend-mow-registry/commit/4b047d825589deac14a1b593dcb9800b62042c93) Thanks [@piemonkey](https://github.com/piemonkey)! - Add control to set default shape to road signs and road markings

## 2.4.0

### Minor Changes

- [#328](https://github.com/lblod/frontend-mow-registry/pull/328) [`b7f82b9`](https://github.com/lblod/frontend-mow-registry/commit/b7f82b937cbc5e8ba994ff2ea87fa826bb62c78b) Thanks [@piemonkey](https://github.com/piemonkey)! - Delete related variables when deleting road signs, road markings and traffic lights

- [#329](https://github.com/lblod/frontend-mow-registry/pull/329) [`8d69765`](https://github.com/lblod/frontend-mow-registry/commit/8d697659645a54817065399ef490337f31d1ad55) Thanks [@elpoelma](https://github.com/elpoelma)! - Add support for adding shapes to road-marking-concepts

- [#328](https://github.com/lblod/frontend-mow-registry/pull/328) [`e6aac44`](https://github.com/lblod/frontend-mow-registry/commit/e6aac44914edebd4c6dbab51c39a8ddd8a418563) Thanks [@piemonkey](https://github.com/piemonkey)! - Add support for variables to road markings and traffic lights

### Patch Changes

- [#330](https://github.com/lblod/frontend-mow-registry/pull/330) [`ef0b998`](https://github.com/lblod/frontend-mow-registry/commit/ef0b998eb75611d9afb95d0756cd34a6abb27076) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fix bug where text filter didn't work on mobility measure

## 2.3.5

### Patch Changes

- [#327](https://github.com/lblod/frontend-mow-registry/pull/327) [`1cfd5ff`](https://github.com/lblod/frontend-mow-registry/commit/1cfd5ffa0564ab62c1bc2dbeac22b8b7392b83ac) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fix search in codelists and icons

## 2.3.4

### Patch Changes

- [#326](https://github.com/lblod/frontend-mow-registry/pull/326) [`0954c3a`](https://github.com/lblod/frontend-mow-registry/commit/0954c3a5b046a82026a61ce4035364b00b8bb249) Thanks [@elpoelma](https://github.com/elpoelma)! - Remove some unnecessary/redundant breadcrumb entries

## 2.3.3

### Patch Changes

- [#325](https://github.com/lblod/frontend-mow-registry/pull/325) [`5f804f4`](https://github.com/lblod/frontend-mow-registry/commit/5f804f47ddd0979fd113c4bc6054e19c81bb8133) Thanks [@elpoelma](https://github.com/elpoelma)! - Traffic-measure form: ensure error state is correctly updated after fixing form errors

- [#324](https://github.com/lblod/frontend-mow-registry/pull/324) [`4c59447`](https://github.com/lblod/frontend-mow-registry/commit/4c59447121eefea0eac7f143cd9bee422cd532a1) Thanks [@elpoelma](https://github.com/elpoelma)! - Traffic measure concepts: correctly wire `templateValue` filter

- [#323](https://github.com/lblod/frontend-mow-registry/pull/323) [`d2ed3f3`](https://github.com/lblod/frontend-mow-registry/commit/d2ed3f36d184bd11d348332ecee042a0b8e96fe0) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fix: the table total number of items was wrong sometimes

## 2.3.2

### Patch Changes

- [#322](https://github.com/lblod/frontend-mow-registry/pull/322) [`47c906a`](https://github.com/lblod/frontend-mow-registry/commit/47c906ad114fba9240ffea2ff2f3450d8ce44d08) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fix search debounce for label and meaning

## 2.3.1

### Patch Changes

- [#321](https://github.com/lblod/frontend-mow-registry/pull/321) [`8d35ec8`](https://github.com/lblod/frontend-mow-registry/commit/8d35ec87d67260200b7f900c4ddf623f218f9b05) Thanks [@nbittich](https://github.com/nbittich)! - Fix codelist creation

## 2.3.0

### Minor Changes

- [#319](https://github.com/lblod/frontend-mow-registry/pull/319) [`6eecbbf`](https://github.com/lblod/frontend-mow-registry/commit/6eecbbfad24664aff80b90b2ec465e2a2a696809) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Add validation to traffic measures

- [#320](https://github.com/lblod/frontend-mow-registry/pull/320) [`eee6153`](https://github.com/lblod/frontend-mow-registry/commit/eee6153785c88a51af28dd934cdac71073caa990) Thanks [@elpoelma](https://github.com/elpoelma)! - Validity dates: set start-date as minimum for end-date date-picker.
  This ensures users are not able to select a date lower than the start-date.
  Additionally, they do not need to navigate back to the same month/year, which should slightly improve UX.

- [#318](https://github.com/lblod/frontend-mow-registry/pull/318) [`e9fd486`](https://github.com/lblod/frontend-mow-registry/commit/e9fd48628a27b3831709a7516e43c8f075c212e4) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Added validity dates to traffic signs, measures and templates

## 2.2.0

### Minor Changes

- [#310](https://github.com/lblod/frontend-mow-registry/pull/310) [`5d40f64`](https://github.com/lblod/frontend-mow-registry/commit/5d40f64eb2f1d039a9b6f8274c2b3ad154c5eaa8) Thanks [@andreo141](https://github.com/andreo141)! - Add ar-plichtig property to signs, markings and lights, along with appropriate filtering and sorting features

### Patch Changes

- [#317](https://github.com/lblod/frontend-mow-registry/pull/317) [`b83f872`](https://github.com/lblod/frontend-mow-registry/commit/b83f872bf4098d64b6b895c40a2a2f9818b70082) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fix: variable name no longer changes on selecting variable type if it was modified before

## 2.1.0

### Minor Changes

- The user can now set the variables as required or not

## 2.0.0

### Major Changes

- [`63f51cc`](https://github.com/lblod/frontend-mow-registry/commit/63f51cc3cdc71fc28ee1faea756a313f9d2d4c80) Thanks [@abeforgit](https://github.com/abeforgit)! - Support new datamodel

### Minor Changes

- [#315](https://github.com/lblod/frontend-mow-registry/pull/315) [`51d70bf`](https://github.com/lblod/frontend-mow-registry/commit/51d70bf895d40dcc850be44356bd9584d0ffa80f) Thanks [@elpoelma](https://github.com/elpoelma)! - Remove no longer supported `annotated` property on `Template` model

- [#261](https://github.com/lblod/frontend-mow-registry/pull/261) [`6bc475c`](https://github.com/lblod/frontend-mow-registry/commit/6bc475c01c2e9aac3accb6b84dc2986cbd3fa0cc) Thanks [@aliokan](https://github.com/aliokan)! - allow registry admins to add/delete icons to concepts within a codelist

- [#254](https://github.com/lblod/frontend-mow-registry/pull/254) [`6636a0e`](https://github.com/lblod/frontend-mow-registry/commit/6636a0e895812eb9081306804b24b3b03b6857e5) Thanks [@aliokan](https://github.com/aliokan)! - Add Icon Catalog

- [#315](https://github.com/lblod/frontend-mow-registry/pull/315) [`51d70bf`](https://github.com/lblod/frontend-mow-registry/commit/51d70bf895d40dcc850be44356bd9584d0ffa80f) Thanks [@elpoelma](https://github.com/elpoelma)! - Add `preview` property to `Template` model and adjust search-field

### Patch Changes

- [#313](https://github.com/lblod/frontend-mow-registry/pull/313) [`17b6c35`](https://github.com/lblod/frontend-mow-registry/commit/17b6c357ebdccd493f00c87061ebfbca2665a322) Thanks [@elpoelma](https://github.com/elpoelma)! - Cleanup unused code related to annotating templates

- [#314](https://github.com/lblod/frontend-mow-registry/pull/314) [`7372299`](https://github.com/lblod/frontend-mow-registry/commit/7372299b9b5d9c3f3b77b35d572f7d63c42b79e7) Thanks [@elpoelma](https://github.com/elpoelma)! - Variables: replace instances of `value` attribute by `label`

- [#264](https://github.com/lblod/frontend-mow-registry/pull/264) [`fb63256`](https://github.com/lblod/frontend-mow-registry/commit/fb63256b6c990eae35f87aa0d08af157ab97494e) Thanks [@andreo141](https://github.com/andreo141)! - Remove all instances of "definition"

## 1.4.5

### Patch Changes

- [#250](https://github.com/lblod/frontend-mow-registry/pull/250) [`1715a27`](https://github.com/lblod/frontend-mow-registry/commit/1715a273571a6484c3724c2cf555b9c39aab998a) Thanks [@elpoelma](https://github.com/elpoelma)! - Add hacky workaround to ensure road-marking and traffic-light concepts can be correctly consumed:
  - Addition of a `zonality` relationship to road-marking and traffic-light concepts
  - Give new road-marking and traffic-light concepts a default zonality of 'non-zonal'

## 1.4.4

### Patch Changes

- [#249](https://github.com/lblod/frontend-mow-registry/pull/249) [`3663a4e`](https://github.com/lblod/frontend-mow-registry/commit/3663a4e2c033e36eee82a910af79489e0fcdc865) Thanks [@elpoelma](https://github.com/elpoelma)! - Ensure that traffic-measures and road-signs have a default zonality of 'non-zonal'

## 1.4.3

### Patch Changes

- [#241](https://github.com/lblod/frontend-mow-registry/pull/241) [`bce0fdf`](https://github.com/lblod/frontend-mow-registry/commit/bce0fdff606a53ebe78680292f7cfaf423ac64ef) Thanks [@elpoelma](https://github.com/elpoelma)! - Show alert to user when template variable names contain invalid characters

- [#238](https://github.com/lblod/frontend-mow-registry/pull/238) [`2a4141f`](https://github.com/lblod/frontend-mow-registry/commit/2a4141fd7ab13f69ba3e734c07bc565e61a095d3) Thanks [@elpoelma](https://github.com/elpoelma)! - Enable no-bare-strings template-lint rule

- [#238](https://github.com/lblod/frontend-mow-registry/pull/238) [`2a4141f`](https://github.com/lblod/frontend-mow-registry/commit/2a4141fd7ab13f69ba3e734c07bc565e61a095d3) Thanks [@elpoelma](https://github.com/elpoelma)! - Fill-in missing translations

## 1.4.2

### Patch Changes

- [`b0d0db7`](https://github.com/lblod/frontend-mow-registry/commit/b0d0db72bfa82d06fc2cb3ede8498bb5b20fae0d) Thanks [@abeforgit](https://github.com/abeforgit)! - bump base images to 4.12

## 1.4.1

### Patch Changes

- [#229](https://github.com/lblod/frontend-mow-registry/pull/229) [`859442c`](https://github.com/lblod/frontend-mow-registry/commit/859442c1504f1c490bb733c191075241318f3634) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix website URL in footer

## 1.4.0

### Minor Changes

- [#224](https://github.com/lblod/frontend-mow-registry/pull/224) [`377c3f4`](https://github.com/lblod/frontend-mow-registry/commit/377c3f4a0e1b382d2b03c27901e5258339884107) Thanks [@elpoelma](https://github.com/elpoelma)! - Update ember-source and related packages to version 4.12 lts

- [#222](https://github.com/lblod/frontend-mow-registry/pull/222) [`469d241`](https://github.com/lblod/frontend-mow-registry/commit/469d2419c1289403b7a3140ee3c1f0f70dd242c2) Thanks [@elpoelma](https://github.com/elpoelma)! - Add `ember-async-data` dependency

### Patch Changes

- [#214](https://github.com/lblod/frontend-mow-registry/pull/214) [`f5af32d`](https://github.com/lblod/frontend-mow-registry/commit/f5af32daca51f1c92025371b574bc220c4c6618d) Thanks [@elpoelma](https://github.com/elpoelma)! - Move to changesets for changelog management

- [#222](https://github.com/lblod/frontend-mow-registry/pull/222) [`469d241`](https://github.com/lblod/frontend-mow-registry/commit/469d2419c1289403b7a3140ee3c1f0f70dd242c2) Thanks [@elpoelma](https://github.com/elpoelma)! - Refactor `zonality-selector` component with `ember-resources`

- [#222](https://github.com/lblod/frontend-mow-registry/pull/222) [`469d241`](https://github.com/lblod/frontend-mow-registry/commit/469d2419c1289403b7a3140ee3c1f0f70dd242c2) Thanks [@elpoelma](https://github.com/elpoelma)! - Ensure zonality of a traffic-measure is awaited before passing it to the `zonality-selector` component

- [#224](https://github.com/lblod/frontend-mow-registry/pull/224) [`3569c48`](https://github.com/lblod/frontend-mow-registry/commit/3569c48fd633ef7fb0f2f37f958084034b9164d5) Thanks [@elpoelma](https://github.com/elpoelma)! - Drop ember-cli-typescript and enable babel typescript transform

- [#223](https://github.com/lblod/frontend-mow-registry/pull/223) [`47396ab`](https://github.com/lblod/frontend-mow-registry/commit/47396ab7f91f33601c71545942cba6857f9f973c) Thanks [@elpoelma](https://github.com/elpoelma)! - Add ember-modifier dependency

- [#215](https://github.com/lblod/frontend-mow-registry/pull/215) [`38ab714`](https://github.com/lblod/frontend-mow-registry/commit/38ab714ad31548e5ec047b39d366cb3eedb1ba15) Thanks [@elpoelma](https://github.com/elpoelma)! - fix wrong translation keys

- [#212](https://github.com/lblod/frontend-mow-registry/pull/212) [`b32cb83`](https://github.com/lblod/frontend-mow-registry/commit/b32cb8312b3003b84908ce349f24ac6457c20989) Thanks [@elpoelma](https://github.com/elpoelma)! - GN-4463: add option to edit definition of road-markings

## 1.3.2 (2023-09-08)

#### :house: Internal

- [#211](https://github.com/lblod/frontend-mow-registry/pull/211) build(deps-dev): bump ember-page-title from 7.0.0 to 8.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#209](https://github.com/lblod/frontend-mow-registry/pull/209) build(deps-dev): bump @babel/eslint-parser from 7.22.11 to 7.22.15 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#210](https://github.com/lblod/frontend-mow-registry/pull/210) build(deps-dev): bump eslint-config-prettier from 8.10.0 to 9.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#208](https://github.com/lblod/frontend-mow-registry/pull/208) build(deps-dev): bump @types/ember\_\_controller from 4.0.5 to 4.0.6 ([@dependabot[bot]](https://github.com/apps/dependabot))

## 1.3.1 (2023-08-31)

#### :bug: Bug Fix

- [#206](https://github.com/lblod/frontend-mow-registry/pull/206) fix(mock-login): correctly pass groupId to login function ([@abeforgit](https://github.com/abeforgit))

#### Committers: 1

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))

## 1.3.0 (2023-08-29)

#### :bug: Bug Fix

- [#194](https://github.com/lblod/frontend-mow-registry/pull/194) GN-4399: check if related road-marking or traffic-light has undefined definition ([@elpoelma](https://github.com/elpoelma))
- [#163](https://github.com/lblod/frontend-mow-registry/pull/163) GN-4353: disable search field trimming ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#202](https://github.com/lblod/frontend-mow-registry/pull/202) Bump ember-template-lint from 4.18.2 to 5.11.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#203](https://github.com/lblod/frontend-mow-registry/pull/203) Bump @babel/eslint-parser from 7.22.9 to 7.22.11 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#204](https://github.com/lblod/frontend-mow-registry/pull/204) Bump ember-concurrency from 3.0.0 to 3.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#200](https://github.com/lblod/frontend-mow-registry/pull/200) Bump @babel/plugin-proposal-decorators from 7.22.7 to 7.22.10 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#199](https://github.com/lblod/frontend-mow-registry/pull/199) Bump ember-resources from 6.1.0 to 6.4.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#205](https://github.com/lblod/frontend-mow-registry/pull/205) Bump semver from 5.7.1 to 5.7.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#147](https://github.com/lblod/frontend-mow-registry/pull/147) Convert source code to typescript ([@elpoelma](https://github.com/elpoelma))
- [#198](https://github.com/lblod/frontend-mow-registry/pull/198) Bump webpack from 5.87.0 to 5.88.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#182](https://github.com/lblod/frontend-mow-registry/pull/182) Bump release-it from 15.6.0 to 16.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#191](https://github.com/lblod/frontend-mow-registry/pull/191) Bump ember-resolver from 10.1.1 to 11.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#192](https://github.com/lblod/frontend-mow-registry/pull/192) Bump ember-cli-app-version from 5.0.0 to 6.0.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#188](https://github.com/lblod/frontend-mow-registry/pull/188) Bump eslint-config-prettier from 8.6.0 to 8.8.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#190](https://github.com/lblod/frontend-mow-registry/pull/190) Bump @babel/eslint-parser from 7.22.6 to 7.22.9 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#186](https://github.com/lblod/frontend-mow-registry/pull/186) Bump word-wrap from 1.2.3 to 1.2.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#184](https://github.com/lblod/frontend-mow-registry/pull/184) Bump @babel/plugin-proposal-decorators from 7.20.13 to 7.22.7 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#185](https://github.com/lblod/frontend-mow-registry/pull/185) Bump eslint-plugin-ember from 11.8.0 to 11.10.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#176](https://github.com/lblod/frontend-mow-registry/pull/176) Bump prettier from 2.8.8 to 3.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#179](https://github.com/lblod/frontend-mow-registry/pull/179) Bump @bagaar/ember-breadcrumbs from 4.0.0 to 4.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#180](https://github.com/lblod/frontend-mow-registry/pull/180) Bump semver from 5.7.1 to 5.7.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#178](https://github.com/lblod/frontend-mow-registry/pull/178) Bump eslint-plugin-qunit from 7.3.4 to 8.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#173](https://github.com/lblod/frontend-mow-registry/pull/173) Bump eslint from 7.32.0 to 8.44.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#171](https://github.com/lblod/frontend-mow-registry/pull/171) Bump ember-mu-login from 2.0.1 to 2.0.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#174](https://github.com/lblod/frontend-mow-registry/pull/174) Bump ember-power-select from 7.0.0 to 7.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#172](https://github.com/lblod/frontend-mow-registry/pull/172) Bump prettier from 2.8.4 to 2.8.8 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#166](https://github.com/lblod/frontend-mow-registry/pull/166) Bump ember-concurrency from 2.3.7 to 3.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#168](https://github.com/lblod/frontend-mow-registry/pull/168) Bump ember-resolver from 8.1.0 to 10.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#169](https://github.com/lblod/frontend-mow-registry/pull/169) Bump @ember/test-helpers from 2.9.3 to 2.9.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#165](https://github.com/lblod/frontend-mow-registry/pull/165) Bump ember-qunit from 6.1.1 to 6.2.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 1.2.0 (2023-06-22)

#### :house: Internal

- [#158](https://github.com/lblod/frontend-mow-registry/pull/158) Bump ember-resources from 5.6.4 to 6.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#157](https://github.com/lblod/frontend-mow-registry/pull/157) Bump ember-cli-dependency-checker from 3.3.1 to 3.3.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#159](https://github.com/lblod/frontend-mow-registry/pull/159) Bump @appuniversum/ember-appuniversum from 2.5.0 to 2.7.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#160](https://github.com/lblod/frontend-mow-registry/pull/160) Bump eslint-plugin-ember from 11.4.6 to 11.8.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#161](https://github.com/lblod/frontend-mow-registry/pull/161) Bump webpack from 5.86.0 to 5.87.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#151](https://github.com/lblod/frontend-mow-registry/pull/151) Bump ember-power-select from 6.0.1 to 7.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#149](https://github.com/lblod/frontend-mow-registry/pull/149) Bump sass from 1.58.0 to 1.63.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#153](https://github.com/lblod/frontend-mow-registry/pull/153) Bump webpack from 5.75.0 to 5.86.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#155](https://github.com/lblod/frontend-mow-registry/pull/155) Bump socket.io-parser from 4.2.2 to 4.2.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#152](https://github.com/lblod/frontend-mow-registry/pull/152) Bump ember-cli-sass from 10.0.1 to 11.0.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#154](https://github.com/lblod/frontend-mow-registry/pull/154) Bump vm2 from 3.9.14 to 3.9.19 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#150](https://github.com/lblod/frontend-mow-registry/pull/150) Bump minimist from 0.2.2 to 0.2.4 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 2

- Jan-Pieter Baert ([@Jan-PieterBaert](https://github.com/Jan-PieterBaert))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 1.1.0 (2023-05-31)

#### :rocket: Enhancement

- [#145](https://github.com/lblod/frontend-mow-registry/pull/145) Hackathon ([@lagartoverde](https://github.com/lagartoverde))

#### :house: Internal

- [#144](https://github.com/lblod/frontend-mow-registry/pull/144) Use new ember-concurrency api ([@elpoelma](https://github.com/elpoelma))

#### Committers: 3

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- [@x-m-el](https://github.com/x-m-el)

## 1.0.3 (2023-03-13)

## 1.0.2 (2023-03-13)

## 1.0.1 (2023-03-13)

## 1.0.0 (2023-03-10)

#### :house: Internal

- [#142](https://github.com/lblod/frontend-mow-registry/pull/142) Upgrade ember-source to 4.8.4 ([@elpoelma](https://github.com/elpoelma))
- [#141](https://github.com/lblod/frontend-mow-registry/pull/141) Update ember-acm-idm login to 2.0.0-beta.1 ([@elpoelma](https://github.com/elpoelma))
- [#140](https://github.com/lblod/frontend-mow-registry/pull/140) Convert translations to kebab-case to ensure consistency ([@elpoelma](https://github.com/elpoelma))

#### Committers: 2

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 0.14.2 (2023-01-24)

#### :bug: Bug Fix

- [#139](https://github.com/lblod/frontend-mow-registry/pull/139) Set zonality on NON_ZONAL when resource does not have any ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 0.16.2 (2023-01-24)

#### :bug: Bug Fix

- [#138](https://github.com/lblod/frontend-mow-registry/pull/138) Update zonality-selector to set zonality if resource does not have any ([@elpoelma](https://github.com/elpoelma))

## 0.14.2 (2023-01-24)

#### :bug: Bug Fix

- [#139](https://github.com/lblod/frontend-mow-registry/pull/139) Set zonality on NON_ZONAL when resource does not have any ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 0.16.1 (2022-11-18)

#### :bug: Bug Fix

- [#137](https://github.com/lblod/frontend-mow-registry/pull/137) Replace duplicate au-main-container ([@Dietr](https://github.com/Dietr))

#### Committers: 1

- Dieter Peirs ([@Dietr](https://github.com/Dietr))

## 0.16.0 (2022-11-07)

#### :rocket: Enhancement

- [#136](https://github.com/lblod/frontend-mow-registry/pull/136) Change content to resource in the codelist triple ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 1

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 0.15.1 (2022-09-20)

#### :rocket: Enhancement

- [#132](https://github.com/lblod/frontend-mow-registry/pull/132) Feature/codelist sources ([@lagartoverde](https://github.com/lagartoverde))

#### :house: Internal

- [#135](https://github.com/lblod/frontend-mow-registry/pull/135) Add release-it ([@elpoelma](https://github.com/elpoelma))
- [#134](https://github.com/lblod/frontend-mow-registry/pull/134) Upgrade to ember-data 3.28.12 with fixes/modifications on how data and relationships are handled ([@elpoelma](https://github.com/elpoelma))

#### Committers: 2

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 0.15.0 (2022-09-06)

#### :rocket: Enhancement

- [#131](https://github.com/lblod/frontend-mow-registry/pull/131) Feature/environment banner ([@elpoelma](https://github.com/elpoelma))

#### :bug: Bug Fix

- [#128](https://github.com/lblod/frontend-mow-registry/pull/128) Bugfix/problems in codelist management ([@lagartoverde](https://github.com/lagartoverde))

#### :house: Internal

- [#130](https://github.com/lblod/frontend-mow-registry/pull/130) Update ember appuniversum to 1.4.1 ([@elpoelma](https://github.com/elpoelma))
- [#129](https://github.com/lblod/frontend-mow-registry/pull/129) update to ember 3.28 lts ([@elpoelma](https://github.com/elpoelma))

#### Committers: 2

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 0.14.1 (2022-07-08)

#### :bug: Bug Fix

- [#127](https://github.com/lblod/frontend-mow-registry/pull/127) added svg to upload types ([@Asergey91](https://github.com/Asergey91))

#### Committers: 1

- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 0.14.0 (2022-03-09)

#### :rocket: Enhancement

- [#81](https://github.com/lblod/frontend-mow-registry/pull/81) enable all relations: signs, lights and marks. ([@bdevloed](https://github.com/bdevloed))

#### :bug: Bug Fix

- [#125](https://github.com/lblod/frontend-mow-registry/pull/125) absolute image paths, please read inside ([@Asergey91](https://github.com/Asergey91))

#### Committers: 2

- Boris De Vloed ([@bdevloed](https://github.com/bdevloed))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 0.13.0 (2022-01-30)

#### :rocket: Enhancement

- [#126](https://github.com/lblod/frontend-mow-registry/pull/126) Feature/configurable auth ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 0.12.0 (2022-01-26)

#### :rocket: Enhancement

- [#124](https://github.com/lblod/frontend-mow-registry/pull/124) added support for temporal signage ([@Asergey91](https://github.com/Asergey91))

#### Committers: 1

- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 0.11.0 (2022-01-20)

#### :rocket: Enhancement

- [#123](https://github.com/lblod/frontend-mow-registry/pull/123) made measures appear fully unwrapped in preview ([@Asergey91](https://github.com/Asergey91))

#### :bug: Bug Fix

- [#122](https://github.com/lblod/frontend-mow-registry/pull/122) Issue GN-3185: Bug on removing signs ([@benjay10](https://github.com/benjay10))

#### Committers: 2

- Ben ([@benjay10](https://github.com/benjay10))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 0.10.0 (2022-01-14)

#### :rocket: Enhancement

- [#120](https://github.com/lblod/frontend-mow-registry/pull/120) Feature/date variables ([@lagartoverde](https://github.com/lagartoverde))
- [#118](https://github.com/lblod/frontend-mow-registry/pull/118) parsing improvements ([@Asergey91](https://github.com/Asergey91))

#### :house: Internal

- [#119](https://github.com/lblod/frontend-mow-registry/pull/119) Content check and design review ([@Dietr](https://github.com/Dietr))

#### Committers: 3

- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 0.9.0 (2022-01-14)

make acm/idm login optional

## 0.8.0 (2021-12-17)

#### :rocket: Enhancement

- [#116](https://github.com/lblod/frontend-mow-registry/pull/116) fix intl initialization and translate mapping types ([@lagartoverde](https://github.com/lagartoverde))
- [#114](https://github.com/lblod/frontend-mow-registry/pull/114) initial implementation of acmidm login ([@nvdk](https://github.com/nvdk))
- [#117](https://github.com/lblod/frontend-mow-registry/pull/117) Zonality selector feature ([@Asergey91](https://github.com/Asergey91))
- [#112](https://github.com/lblod/frontend-mow-registry/pull/112) rdfa annotate ([@Asergey91](https://github.com/Asergey91))

#### :bug: Bug Fix

- [#113](https://github.com/lblod/frontend-mow-registry/pull/113) Fix multiple table bug ([@Dietr](https://github.com/Dietr))

#### Committers: 4

- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 0.7.0 (2021-12-01)

#### :rocket: Enhancement

- [#103](https://github.com/lblod/frontend-mow-registry/pull/103) feature: improved support for measures and linking instructions to measures ([@Asergey91](https://github.com/Asergey91))

#### :bug: Bug Fix

- [#109](https://github.com/lblod/frontend-mow-registry/pull/109) Bugfix/codelists ([@Asergey91](https://github.com/Asergey91))

#### :house: Internal

- [#110](https://github.com/lblod/frontend-mow-registry/pull/110) Review traffic measure design ([@Dietr](https://github.com/Dietr))

#### Committers: 2

- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 0.6.0 (2021-11-28)

#### :rocket: Enhancement

- [#107](https://github.com/lblod/frontend-mow-registry/pull/107) Cleanup design for codelist form and detail page ([@Dietr](https://github.com/Dietr))
- [#104](https://github.com/lblod/frontend-mow-registry/pull/104) Add codelist management module ([@claire-lovisa](https://github.com/claire-lovisa))
- [#99](https://github.com/lblod/frontend-mow-registry/pull/99) Feature/codelist UI ([@Asergey91](https://github.com/Asergey91))

#### :bug: Bug Fix

- [#106](https://github.com/lblod/frontend-mow-registry/pull/106) Fix measure relations not deleted properly ([@claire-lovisa](https://github.com/claire-lovisa))
- [#105](https://github.com/lblod/frontend-mow-registry/pull/105) Code not displaying after refreshing ([@claire-lovisa](https://github.com/claire-lovisa))
- [#101](https://github.com/lblod/frontend-mow-registry/pull/101) Bugfix/quality of life ([@Asergey91](https://github.com/Asergey91))
- [#100](https://github.com/lblod/frontend-mow-registry/pull/100) Chore/improve road markings ([@nvdk](https://github.com/nvdk))

#### Committers: 4

- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))
- [@claire-lovisa](https://github.com/claire-lovisa)

## 0.5.1 (2021-11-15)

#### :bug: Bug Fix

- [#100](https://github.com/lblod/frontend-mow-registry/pull/100) Chore/improve road markings ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 0.5.0 (2021-11-15)

#### :rocket: Enhancement

- [#99](https://github.com/lblod/frontend-mow-registry/pull/99) Feature/codelist UI ([@Asergey91](https://github.com/Asergey91))

#### Committers: 1

- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 0.4.1 (2021-11-15)

#### :bug: Bug Fix

- [#98](https://github.com/lblod/frontend-mow-registry/pull/98) Internal/refactor forms ([@nvdk](https://github.com/nvdk))

#### :house: Internal

- [#98](https://github.com/lblod/frontend-mow-registry/pull/98) Internal/refactor forms ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 0.4.0 (2021-11-10)

#### :rocket: Enhancement

- [#94](https://github.com/lblod/frontend-mow-registry/pull/94) made instructions editable ([@Asergey91](https://github.com/Asergey91))
- [#95](https://github.com/lblod/frontend-mow-registry/pull/95) added ability to verify content ([@Asergey91](https://github.com/Asergey91))
- [#91](https://github.com/lblod/frontend-mow-registry/pull/91) Add templates to road instructions ([@claire-lovisa](https://github.com/claire-lovisa))
- [#86](https://github.com/lblod/frontend-mow-registry/pull/86) Add sparql route with yasgui to the frontend ([@nvdk](https://github.com/nvdk))
- [#88](https://github.com/lblod/frontend-mow-registry/pull/88) Add all sorts of signs with power select ([@claire-lovisa](https://github.com/claire-lovisa))
- [#83](https://github.com/lblod/frontend-mow-registry/pull/83) Add ember-data models for the mow model ([@abeforgit](https://github.com/abeforgit))

#### :bug: Bug Fix

- [#93](https://github.com/lblod/frontend-mow-registry/pull/93) fixed bug where the change to the type of a newly created variable wasn't displayed ([@Asergey91](https://github.com/Asergey91))
- [#89](https://github.com/lblod/frontend-mow-registry/pull/89) fix collapsing button on small screens ([@Dietr](https://github.com/Dietr))
- [#87](https://github.com/lblod/frontend-mow-registry/pull/87) Bugfix/various ([@Asergey91](https://github.com/Asergey91))

#### :house: Internal

- [#92](https://github.com/lblod/frontend-mow-registry/pull/92) Use traffic-measure-concept for measures model ([@claire-lovisa](https://github.com/claire-lovisa))

#### Committers: 11

- Anita Caron ([@anitacaron](https://github.com/anitacaron))
- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Boris De Vloed ([@bdevloed](https://github.com/bdevloed))
- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Nordine Bittich ([@nbittich](https://github.com/nbittich))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))
- [@claire-lovisa](https://github.com/claire-lovisa)
- [@gcapurso](https://github.com/gcapurso)
