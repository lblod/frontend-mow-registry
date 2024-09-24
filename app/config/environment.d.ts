/**
 * Type declarations for
 *    import config from 'mow-registry/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none';
  rootURL: string;
  APP: Record<string, unknown>;
  baseUrl?: string;
  torii: {
    disableRedirectInitializer: boolean;
    providers: {
      'acmidm-oauth2': {
        apiKey: string;
        baseUrl: string;
        scope: string;
        redirectUri: string;
        logoutUrl: string;
      };
    };
  };
  sparqlEndpoint: string;
  environmentName: string;
  featureFlags: {
    simpleLogin: boolean;
  };
};

export default config;
