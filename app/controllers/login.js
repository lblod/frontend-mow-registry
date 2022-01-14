import Controller from '@ember/controller';
import ENV from 'mow-registry/config/environment';

export default class LoginController extends Controller {
  get showSimpleLogin() {
    const simpleLogin = ENV.featureFlags.simpleLogin;
    if (typeof simpleLogin == 'boolean') {
      return simpleLogin;
    } else {
      return simpleLogin === 'true';
    }
  }
}
