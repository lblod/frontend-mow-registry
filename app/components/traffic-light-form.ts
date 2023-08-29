import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import TrafficLightConceptValidations from 'mow-registry/validations/traffic-light-concept';
import ImageUploadHandlerComponent from './image-upload-handler';
import { BufferedChangeset } from 'ember-changeset/types';
import Router from '@ember/routing/router';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';

type Args = {
  trafficLightConcept: TrafficLightConceptModel;
};

export default class TrafficLightFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: Router;

  TrafficLightConceptValidations = TrafficLightConceptValidations;

  get isSaving() {
    return this.editTrafficLightConceptTask.isRunning;
  }

  @action
  setTrafficLightConceptValue(
    changeset: BufferedChangeset,
    attributeName: string,
    event: InputEvent,
  ) {
    changeset[attributeName] = (event.target as HTMLInputElement).value;
  }

  editTrafficLightConceptTask = dropTask(
    async (changeset: BufferedChangeset, event: InputEvent) => {
      event.preventDefault();

      await changeset.validate();

      if (changeset.isValid) {
        await this.saveImage(changeset);
        await changeset.save();

        await this.router.transitionTo(
          'traffic-light-concepts.traffic-light-concept',
          changeset.id,
        );
      }
    },
  );

  willDestroy() {
    super.willDestroy();
    this.args.trafficLightConcept.rollbackAttributes();
  }
}
