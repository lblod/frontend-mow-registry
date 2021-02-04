import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service router;
  @service intl;

  @action
  async removeRoadSignConcept(roadsignconcept, event) {
    event.preventDefault();

    if (confirm(this.intl.t('confirmation'))) {
      await roadsignconcept.destroyRecord();
      this.router.transitionTo('roadsign-concepts');
    }
  }
}
