'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const isProductionBuild = process.env.EMBER_ENV === 'production';

module.exports = async function (defaults) {
  const { setConfig } = await import('@warp-drive/build-config');
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
    autoprefixer: {
      enabled: true,
      cascade: true,
      sourcemap: true,
    },
  });

  setConfig(app, __dirname, {
    // this should be the most recent <major>.<minor> version for
    // which all deprecations have been fully resolved
    // and should be updated when that changes
    compatWith: '4.12',
    deprecations: {
      DEPRECATE_TRACKING_PACKAGE: false,
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
