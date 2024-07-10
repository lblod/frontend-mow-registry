import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import ImageUploadHandlerComponent from './image-upload-handler';
import Router from '@ember/routing/router';
import TrafficLightConceptModel from 'mow-registry/models/traffic-light-concept';

type Args = {
  trafficLightConcept: TrafficLightConceptModel;
};

export default class TrafficLightFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: Router;

  get isSaving() {
    return this.editTrafficLightConceptTask.isRunning;
  }

  @action
  async setTrafficLightConceptValue(
    attributeName: keyof TrafficLightConceptModel,
    event: InputEvent,
  ) {
    await this.args.trafficLightConcept.set(
      attributeName,
      (event.target as HTMLInputElement).value,
    );
    await this.args.trafficLightConcept.validate();
  }

  editTrafficLightConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    await this.args.trafficLightConcept.validate();

    if (!this.args.trafficLightConcept.error) {
      const imagePath = await this.saveImage();
      if (imagePath) this.args.trafficLightConcept.image = imagePath;
      await this.args.trafficLightConcept.save();

      await this.router.transitionTo(
        'traffic-light-concepts.traffic-light-concept',
        this.args.trafficLightConcept.id,
      );
    }
  });

  @action
  async setImage(model: TrafficLightConceptModel, image: File | string) {
    super.setImage(model, image);
    await this.args.trafficLightConcept.validate();
  }

  willDestroy() {
    super.willDestroy();
    this.args.trafficLightConcept.reset();
  }
}
