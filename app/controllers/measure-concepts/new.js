import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MeasureConceptsNewController extends Controller {
  @tracked isSaving = false;
  @service router;

  @action
  setMeasureConceptValue(attributeName, event) {
    this.model.newMeasureConcept[attributeName] = event.target.value;
  }

  @action
  setMeasureConceptRoadSignConcept(selection) {
    this.model.newMeasureConcept.roadsignconcept = selection;
  }

  @action
  async createMeasureConcept(event) {
    event.preventDefault();

    if (!this.isSaving) {
      this.isSaving = true;

      await this.model.newMeasureConcept.save();

      this.isSaving = false;

      this.router.transitionTo(
        'measure-concepts.measure-concept',
        this.model.newMeasureConcept.id
      );
    }
  }
}
