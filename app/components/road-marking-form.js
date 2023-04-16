import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadMarkingConceptValidations from 'mow-registry/validations/road-marking-concept';
import ImageUploadHandlerComponent from './image-upload-handler';

export default class RoadMarkingFormComponent extends ImageUploadHandlerComponent {
  @service router;

  RoadMarkingConceptValidations = RoadMarkingConceptValidations;

  get isSaving() {
    return this.editRoadMarkingConceptTask.isRunning;
  }

  @action
  setRoadMarkingConceptValue(changeset, attributeName, event) {
    changeset[attributeName] = event.target.value;
  }

  editRoadMarkingConceptTask = dropTask(async (changeset, event) => {
    event.preventDefault();

    changeset.image = await this.saveImage();
    await changeset.validate();

    if (changeset.isValid) {
      await changeset.save();

      this.router.transitionTo(
        'road-marking-concepts.road-marking-concept',
        changeset.id
      );
    }
  });

  async willDestroy() {
    super.willDestroy(...arguments);
    this.args.roadMarkingConcept.rollbackAttributes();
  }
}
