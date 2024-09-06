import Router from '@ember/routing/router';
import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import IconModel from 'mow-registry/models/icon';

type Args = {
  icon: IconModel;
};
export default class IconCatalogFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: Router;

  get isSaving() {
    return this.editIconTask.isRunning;
  }

  @action
  async setIconValue(attributeName: keyof IconModel, event: InputEvent) {
    // remove leading spaces so they don't mess up the sorting mechanism
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue = inputElement.value.trim();

    await this.args.icon.set(attributeName, trimmedValue);

    // Validate the icon model
    await this.args.icon.validate();
  }

  @action
  async setImage(model: IconModel, image: File) {
    super.setImage(model, image);
    await this.args.icon.validate();
  }

  editIconTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    await this.args.icon.validate();

    if (!this.args.icon.error) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.icon.set('image', imageRecord); // image gets updated, but not overwritten
      await this.args.icon.save();

      await this.router.transitionTo('icon-catalog.icon', this.args.icon.id);
    }
  });

  willDestroy() {
    super.willDestroy();
    this.args.icon.reset();
  }
}
