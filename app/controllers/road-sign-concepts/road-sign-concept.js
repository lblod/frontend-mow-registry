import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RoadsignConceptsRoadsignConceptController extends Controller {
  @service router;
  @service intl;

  get hasActiveChildRoute() {
    return (
      this.router.currentRouteName.startsWith('road-sign-concepts.') &&
      this.router.currentRouteName != 'road-sign-concepts.road-sign-concept'
    );
  }

  @action
  async removeRoadSignConcept(roadSignConcept, event) {
    event.preventDefault();

    await roadSignConcept.destroyRecord();
    this.router.transitionTo('road-sign-concepts');
  }
}
