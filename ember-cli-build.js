'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const isProductionBuild = process.env.EMBER_ENV === 'production';

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
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

  app.import('node_modules/@triply/yasgui/build/yasgui.min.css');

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
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
