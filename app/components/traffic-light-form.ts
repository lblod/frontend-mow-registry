import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import ImageUploadHandlerComponent from './image-upload-handler';
import type RouterService from '@ember/routing/router-service';
import TrafficLightConcept from 'mow-registry/models/traffic-light-concept';
import Store from '@ember-data/store';
import TrafficSignConcept from 'mow-registry/models/traffic-sign-concept';
import type { ModifiableKeysOfType } from 'mow-registry/utils/type-utils';

type Args = {
  trafficLightConcept: TrafficLightConcept;
};

export default class TrafficLightFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: RouterService;
  @service declare store: Store;

  get isSaving() {
    return this.editTrafficLightConceptTask.isRunning;
  }

  @action
  async setTrafficLightConceptValue(
    attributeName: ModifiableKeysOfType<TrafficLightConcept, string>,
    event: InputEvent,
  ) {
    this.args.trafficLightConcept[attributeName] = (
      event.target as HTMLInputElement
    ).value;
    await this.args.trafficLightConcept.validateProperty(attributeName);
  }

  @action
  async setBooleanValue(
    attributeName: ModifiableKeysOfType<TrafficLightConcept, boolean>,
    value: boolean,
  ) {
    this.args.trafficLightConcept[attributeName] = value;
    await this.args.trafficLightConcept.validateProperty(attributeName);
  }
  editTrafficLightConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();
    await this.args.trafficLightConcept.validate();

    if (!this.args.trafficLightConcept.error) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.trafficLightConcept.set('image', imageRecord); // image gets uploaded but not replaced
      await this.args.trafficLightConcept.save();

      this.router.transitionTo(
        'traffic-light-concepts.traffic-light-concept',
        this.args.trafficLightConcept.id,
      );
    }
  });

  @action
  async setImage(model: TrafficSignConcept, image: File) {
    super.setImage(model, image);
    await this.args.trafficLightConcept.validateProperty('image');
  }

  willDestroy() {
    super.willDestroy();
    this.args.trafficLightConcept.reset();
  }
}
