import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MeasureConceptsMeasureConceptController extends Controller {
  @service router;
  @service intl;

  @action
  async removeMeasureConcept(measureconcept, event) {
    event.preventDefault();

    await measureconcept.destroyRecord();
    this.router.transitionTo('measure-concepts');
  }
}
