'use strict';

const supportedLocales = {
  nl: 'nl-be',
  en: 'en-us',
};

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'mow-registry',
    environment,
    rootURL: '/',
    locationType: 'history',
    sparqlEndpoint: '{{SPARQL_ENDPOINT}}',
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
      EXTEND_PROTOTYPES: false,
    },
    torii: {
      disableRedirectInitializer: true,
      providers: {
        'acmidm-oauth2': {
          apiKey: '{{ACM_API_KEY}}',
          baseUrl: '{{ACM_BASE_URL}}',
          scope: 'openid vo profile abb_registermobiliteit',
          redirectUri: '{{ACM_REDIRECT_URL}}',
          logoutUrl: '{{ACM_LOGOUT_URL}}',
        },
      },
    },
    featureFlags: {},
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    environmentName: '{{ENVIRONMENT_NAME}}',
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.featureFlags.simpleLogin = true;
    ENV.sparqlEndpoint = 'http://localhost/sparql';
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
    ENV.baseUrl = '{{BASE_URL}}';
    // here you can enable a production-specific feature
  }

  return ENV;
};
