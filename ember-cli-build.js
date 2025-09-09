'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const isProductionBuild = process.env.EMBER_ENV === 'production';

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
    // Add options here
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    '@appuniversum/ember-appuniversum': {
      disableWormholeElement: true,
    },
    // This is required to make the `staticEmberSource` flag work
    // We should move away from ember-fetch (https://github.com/ember-cli/ember-fetch/issues/656), but some addons do still use it
    'ember-fetch': {
      preferNative: true,
      nativePromise: true,
    },
    autoprefixer: {
      enabled: true,
      cascade: true,
      sourcemap: true,
    },
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    // The inspector acts strange when this flag is enabled so we only do it for production builds for now.
    // https://github.com/emberjs/ember.js/pull/20580
    staticEmberSource: isProductionBuild,
    splitAtRoutes: [
      'road-sign-concepts',
      'road-marking-concepts',
      'traffic-light-concepts',
      'traffic-measure-concepts',
      'codelists-management',
      'icon-catalog',
      'sparql',
    ],
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
