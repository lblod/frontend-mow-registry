import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import TrafficLightConceptValidations from 'mow-registry/validations/traffic-light-concept';
import ImageUploadHandlerComponent from './image-upload-handler';

export default class TrafficLightFormComponent extends ImageUploadHandlerComponent {
  @service router;

  TrafficLightConceptValidations = TrafficLightConceptValidations;

  get isSaving() {
    return this.editTrafficLightConceptTask.isRunning;
  }

  @action
  setTrafficLightConceptValue(changeset, attributeName, event) {
    changeset[attributeName] = event.target.value;
  }

  @action
  setTrafficLightConceptCategory(changeset, selection) {
    changeset.categories = selection;
  }

  editTrafficLightConceptTask = dropTask(async (changeset, event) => {
    event.preventDefault();

    await changeset.validate();

    if (changeset.isValid) {
      changeset.image = await this.saveImage();
      await changeset.save();

      this.router.transitionTo(
        'traffic-light-concepts.traffic-light-concept',
        changeset.id
      );
    }
  });

  async willDestroy() {
    super.willDestroy(...arguments);
    this.args.trafficLightConcept.rollbackAttributes();
  }
}
