import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import ImageUploadHandlerComponent from './image-upload-handler';
import type RouterService from '@ember/routing/router-service';
import RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import Store from '@ember-data/store';
import TrafficSignConcept from 'mow-registry/models/traffic-sign-concept';

type Args = {
  roadMarkingConcept: RoadMarkingConcept;
};

export default class RoadMarkingFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: RouterService;
  @service declare store: Store;

  get isSaving() {
    return this.editRoadMarkingConceptTask.isRunning;
  }

  @action
  async setRoadMarkingConceptValue(attributeName: string, event: InputEvent) {
    this.args.roadMarkingConcept.set(
      attributeName,
      (event.target as HTMLInputElement).value,
    );
    await this.args.roadMarkingConcept.validateProperty(attributeName);
  }

  editRoadMarkingConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    await this.args.roadMarkingConcept.validate();

    if (!this.args.roadMarkingConcept.error) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.roadMarkingConcept.set('image', imageRecord);
      await this.args.roadMarkingConcept.save();

      await this.router.transitionTo(
        'road-marking-concepts.road-marking-concept',
        this.args.roadMarkingConcept.id,
      );
    }
  });

  @action
  async setImage(model: TrafficSignConcept, image: File) {
    super.setImage(model, image);
    await this.args.roadMarkingConcept.validateProperty('image');
  }

  willDestroy() {
    super.willDestroy();
    this.args.roadMarkingConcept.reset();
  }
}
