import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MeasureConceptsEditController extends Controller {
  @tracked isSaving = false;
  @service router;

  @action
  setMeasureConceptValue(attributeName, event) {
    this.model.measureConcept[attributeName] = event.target.value;
  }

  @action
  setMeasureConceptRoadSignConcept(selection) {
    this.model.measureConcept.roadsignconcept = selection;
  }

  @action
  async editMeasureConcept(event) {
    event.preventDefault();

    if (!this.isSaving) {
      this.isSaving = true;

      await this.model.measureConcept.save();

      this.isSaving = false;

      this.router.transitionTo(
        'measure-concepts.measure-concept',
        this.model.measureConcept.id
      );
    }
  }
}
