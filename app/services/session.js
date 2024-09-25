import BaseSessionService from 'ember-simple-auth/services/session';
import ENV from 'mow-registry/config/environment';

export default class SessionService extends BaseSessionService {
  handleInvalidation(routeAfterInvalidation) {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];

    if (!logoutUrl.startsWith('{{')) {
      super.handleInvalidation(logoutUrl);
    } else {
      super.handleInvalidation(routeAfterInvalidation);
    }
  }
}
