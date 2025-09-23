import type RouterService from '@ember/routing/router-service';
import ImageUploadHandlerComponent from './image-upload-handler';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import Icon from 'mow-registry/models/icon';
import { saveRecord } from '@warp-drive/legacy/compat/builders';
import type Store from 'mow-registry/services/store';

type Args = {
  icon: Icon;
};
export default class IconCatalogFormComponent extends ImageUploadHandlerComponent<Args> {
  @service declare router: RouterService;
  @service declare store: Store;

  get isSaving() {
    return this.editIconTask.isRunning;
  }

  @action
  async setIconValue(attributeName: keyof Icon, event: InputEvent) {
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue = inputElement.value.trim();

    this.args.icon.set(attributeName, trimmedValue);

    // Validate the icon model
    await this.args.icon.validate();
  }

  @action
  setImage(model: Icon, image: File) {
    super.setImage(model, image);
    void this.args.icon.validate();
  }

  editIconTask = dropTask(async (event: InputEvent) => {
    event.preventDefault();

    await this.args.icon.validate();

    if (!this.args.icon.error) {
      const imageRecord = await this.saveImage();
      if (imageRecord) this.args.icon.set('image', imageRecord); // image gets updated, but not overwritten\
      await this.store.request(saveRecord(this.args.icon));

      await this.router.transitionTo('icon-catalog.icon', this.args.icon.id);
    }
  });

  willDestroy() {
    super.willDestroy();
    this.args.icon.reset();
  }
}
