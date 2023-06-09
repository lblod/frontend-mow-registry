//@ts-expect-error types of ember-simple-auth are not yet published
import BaseSessionService from 'ember-simple-auth/services/session';
import ENV from 'mow-registry/config/environment';

export default class SessionService extends BaseSessionService {
  handleInvalidation() {
    const logoutUrl = ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    super.handleInvalidation(logoutUrl);
  }
}
