'use strict';

const supportedLocales = {
  nl: 'nl-be',
  en: 'en-us',
};

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'mow-registry',
    environment,
    rootURL: '/',
    locationType: 'auto',
    yasgui: {
      // NOTE: look at app/modifiers/yasgui.js when changing this variable
      defaultQuery: 'EMBER_YASGUI_DEFAULT_QUERY',
      extraPrefixes: 'EMBER_YASGUI_EXTRA_PREFIXES',
    },
    defaultLocale:
      environment === 'production' ? supportedLocales.nl : supportedLocales.en,
    supportedLocales,
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },
    torii: {
      disableRedirectInitializer: true,
      providers: {
        'acmidm-oauth2': {
          apiKey: 'ae3be0bb-5c5d-447f-9916-1ea819267e53',
          baseUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/auth',
          scope: 'openid vo profile abb_registermobiliteit',
          redirectUri: 'https://roadsigns.lblod.info/authorization/callback',
          logoutUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/logout',
        },
      },
    },
    featureFlags: {},
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    baseUrl: '{{BASE_URL}}'
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.featureFlags.simpleLogin = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.featureFlags.simpleLogin = '{{SIMPLE_LOGIN}}';
    // here you can enable a production-specific feature
  }

  return ENV;
};
