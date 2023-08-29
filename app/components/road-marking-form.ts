import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadMarkingConceptValidations from 'mow-registry/validations/road-marking-concept';
import ImageUploadHandlerComponent from './image-upload-handler';
import { BufferedChangeset } from 'ember-changeset/types';
import Router from '@ember/routing/router';
import RoadMarkingConceptModel from 'mow-registry/models/road-marking-concept';

type Args = {
  roadMarkingConcept: RoadMarkingConceptModel;
};

export default class RoadMarkingFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: Router;

  RoadMarkingConceptValidations = RoadMarkingConceptValidations;

  get isSaving() {
    return this.editRoadMarkingConceptTask.isRunning;
  }

  @action
  setRoadMarkingConceptValue(
    changeset: BufferedChangeset,
    attributeName: string,
    event: InputEvent,
  ) {
    changeset[attributeName] = (event.target as HTMLInputElement).value;
  }

  editRoadMarkingConceptTask = dropTask(
    async (changeset: BufferedChangeset, event: InputEvent) => {
      event.preventDefault();

      await this.saveImage(changeset);
      await changeset.validate();

      if (changeset.isValid) {
        await changeset.save();

        await this.router.transitionTo(
          'road-marking-concepts.road-marking-concept',
          changeset.id,
        );
      }
    },
  );

  willDestroy() {
    super.willDestroy();
    this.args.roadMarkingConcept.rollbackAttributes();
  }
}
