import Router from '@ember/routing/router';
import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import RoadSignConceptModel from 'mow-registry/models/road-sign-concept';
import RoadSignCategoryModel from 'mow-registry/models/road-sign-category';
import SkosConcept from 'mow-registry/models/skos-concept';

type Args = {
  roadSignConcept: RoadSignConceptModel;
};
export default class RoadSignFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: Router;
  @service declare store: Store;

  get isSaving() {
    return this.editRoadSignConceptTask.isRunning;
  }

  @action
  async setRoadSignConceptValue(
    attributeName: keyof RoadSignConceptModel,
    event: InputEvent,
  ) {
    await this.args.roadSignConcept.set(
      attributeName,
      (event.target as HTMLInputElement).value,
    );
    await this.args.roadSignConcept.validate();
  }

  @action
  async setRoadSignConceptCategory(selection: RoadSignCategoryModel[]) {
    this.args.roadSignConcept.set('categories', selection);
    await this.args.roadSignConcept.validate();
  }

  @action
  async setRoadSignConceptZonality(selection: SkosConcept) {
    this.args.roadSignConcept.set('zonality', selection);
    await this.args.roadSignConcept.validate();
  }

  @action
  async setImage(model: RoadSignConceptModel, image: File | string) {
    super.setImage(model, image);
    await this.args.roadSignConcept.validate();
  }

  editRoadSignConceptTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    await this.args.roadSignConcept.validate();

    if (!this.args.roadSignConcept.error) {
      const imagePath = await this.saveImage();
      if (imagePath) this.args.roadSignConcept.image = imagePath;
      await this.args.roadSignConcept.save();

      await this.router.transitionTo(
        'road-sign-concepts.road-sign-concept',
        this.args.roadSignConcept.id,
      );
    }
  });

  willDestroy() {
    super.willDestroy();
    this.args.roadSignConcept.reset();
  }
}
