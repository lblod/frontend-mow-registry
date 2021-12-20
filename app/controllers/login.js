import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
export default class LoginController extends Controller {
  @service features;

  get showSimpleLogin() {
    if (typeof this.features.get('simpleLogin') == "boolean") {
      return this.features.get('simpleLogin');
    }
    else {
      return this.get.features.get('simpleLogin') === "true";
    }
  }
}
