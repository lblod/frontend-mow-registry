import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import ImageUploadHandlerComponent from './image-upload-handler';
import type RouterService from '@ember/routing/router-service';
import RoadMarkingConcept from 'mow-registry/models/road-marking-concept';
import Store from '@ember-data/store';
import TrafficSignConcept from 'mow-registry/models/traffic-sign-concept';
import type { ModifiableKeysOfType } from 'mow-registry/utils/type-utils';

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
  async setRoadMarkingConceptValue(
    attributeName: ModifiableKeysOfType<RoadMarkingConcept, string>,
    event: InputEvent,
  ) {
    this.args.roadMarkingConcept[attributeName] = (
      event.target as HTMLInputElement
    ).value;
    await this.args.roadMarkingConcept.validateProperty(attributeName);
  }

  @action
  async setBooleanValue(
    attributeName: ModifiableKeysOfType<RoadMarkingConcept, boolean>,
    value: boolean,
  ) {
    this.args.roadMarkingConcept[attributeName] = value;
    await this.args.roadMarkingConcept.validateProperty(attributeName);
  }
  @action
  async setRoadMarkingDate(attribute: string, isoDate: string, date: Date) {
    if (attribute === 'endDate') {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
    }
    this.args.roadMarkingConcept.set(attribute, date);
    if (
      this.args.roadMarkingConcept.startDate &&
      this.args.roadMarkingConcept.endDate
    ) {
      await this.args.roadMarkingConcept.validateProperty('startDate', {
        warnings: true,
      });
      await this.args.roadMarkingConcept.validateProperty('endDate', {
        warnings: true,
      });
    }
  }

  editRoadMarkingConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    await this.args.roadMarkingConcept.validate();

    if (!this.args.roadMarkingConcept.error) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.roadMarkingConcept.set('image', imageRecord);
      await this.args.roadMarkingConcept.save();

      this.router.transitionTo(
        'road-marking-concepts.road-marking-concept',
        this.args.roadMarkingConcept.id,
      );
    }
  });

  @action
  setImage(model: TrafficSignConcept, image: File) {
    super.setImage(model, image);
    void this.args.roadMarkingConcept.validateProperty('image');
  }

  willDestroy() {
    super.willDestroy();
    this.args.roadMarkingConcept.reset();
  }
}
