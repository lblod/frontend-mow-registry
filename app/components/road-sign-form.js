import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadSignConceptValidations from 'mow-registry/validations/road-sign-concept';

export default class RoadSignFormComponent extends ImageUploadHandlerComponent {
  @service router;

  RoadSignConceptValidations = RoadSignConceptValidations;

  get isSaving() {
    return this.editRoadSignConceptTask.isRunning;
  }

  @action
  setRoadSignConceptCategory(changeset, selection) {
    changeset.categories = selection;
  }

  editRoadSignConceptTask = dropTask(async (changeset, event) => {
    event.preventDefault();

    await changeset.validate();

    if (changeset.isValid) {
      await this.saveImage(changeset);
      await changeset.save();

      this.router.transitionTo(
        'road-sign-concepts.road-sign-concept',
        changeset.id,
      );
    }
  });

  async willDestroy() {
    super.willDestroy(...arguments);
    this.args.roadSignConcept.rollbackAttributes();
  }
}
