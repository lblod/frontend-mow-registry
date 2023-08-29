import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import SessionService from 'mow-registry/services/session';
import ENV from 'mow-registry/config/environment';

export default class ApplicationController extends Controller {
  @service declare session: SessionService;
  queryParams = ['lang'];

  lang = '';

  @action
  logout() {
    //@ts-expect-error types of ember-simple-auth are not yet published
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.session.invalidate();
  }

  get environmentName() {
    return ENV.environmentName;
  }

  get showEnvironment() {
    return (
      this.environmentName !== '' &&
      this.environmentName !== '{{ENVIRONMENT_NAME}}'
    );
  }
}
