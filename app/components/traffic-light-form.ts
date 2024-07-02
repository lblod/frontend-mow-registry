import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import TrafficLightConceptValidations from 'mow-registry/validations/traffic-light-concept';
import ImageUploadHandlerComponent from './image-upload-handler';
import { BufferedChangeset } from 'ember-changeset/types';
import Router from '@ember/routing/router';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';
import Store from '@ember-data/store';

type Args = {
  trafficLightConcept: TrafficLightConceptModel;
};

export default class TrafficLightFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: Router;
  @service declare store: Store;

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
        const image = await this.saveImage(this.store);
        if (image) {
          changeset.image = image;
        }
        try {
          await changeset.save();
        } catch (error) {
          console.error('Error saving changeset:', error);
        }
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
