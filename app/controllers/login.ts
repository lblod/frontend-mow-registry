import Controller from '@ember/controller';
import ENV from 'mow-registry/config/environment';
import config from 'mow-registry/config/environment';
//@ts-expect-error ember-acm-idm does not contain type definitions
import buildUrlFromConfig from '@lblod/ember-acmidm-login/utils/build-url-from-config';
const providerConfig = config.torii.providers['acmidm-oauth2'];

export default class LoginController extends Controller {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  loginUrl: string = buildUrlFromConfig(providerConfig);

  get showSimpleLogin() {
    const simpleLogin = ENV.featureFlags.simpleLogin;
    if (typeof simpleLogin == 'boolean') {
      return simpleLogin;
    } else {
      return simpleLogin === 'true';
    }
  }
}
