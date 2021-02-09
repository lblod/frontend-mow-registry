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
    this.model.measureConcept.roadSignConcept = selection;
  }

  @action
  async setMeasureConceptCombination(selection) {
    // let roadSignCombination = await this.store.findRecord(
    //   'road-sign-combination',
    //   this.model.measureConcept.roadSignCombination.get('id')
    // );
    // roadSignCombination.measureConcepts = selection;
    // await roadSignCombination.save();
    // this.model.measureConcept.roadSignCombination = roadSignCombination;

    const roadSignCombination = await this.model.measureConcept.get(
      'roadSignCombination'
    );
    roadSignCombination.set('measureConcepts', selection);
  }

  @action
  async editMeasureConcept(event) {
    event.preventDefault();

    if (!this.isSaving) {
      this.isSaving = true;

      const roadSignCombination = await this.model.measureConcept.get(
        'roadSignCombination'
      );
      await roadSignCombination.save();

      await this.model.measureConcept.save();

      this.isSaving = false;

      this.router.transitionTo(
        'measure-concepts.measure-concept',
        this.model.measureConcept.id
      );
    }
  }

  get notValid() {
    return (
      !this.model.measureConcept.description ||
      !this.model.measureConcept.get('roadSignConcept.id')
    );
  }
}
