import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import FileService from 'mow-registry/services/file-service';
import Store from '@ember-data/store';
import TrafficSignConceptModel from 'mow-registry/models/traffic-sign-concept';

/**
 * A helper for uploading images, used in conjunction with `image-input.js`
 * - If it is a local file, it is uploaded to the backend.
 * - If it is a URL, it will not be uploaded and instead the direct link will be used.
 *   the URL format is often used with digital asset management tools.
 */
export default class ImageUploadHandlerComponent<
  T = unknown,
> extends Component<T> {
  @service declare fileService: FileService;
  @service declare store: Store;

  fileData?: File | null;

  isFileUrl(file: File | string): file is string {
    return typeof file === 'string';
  }

  setImage(model: TrafficSignConceptModel, image: File) {
    this.fileData = image;
    if (!model.image.content) {
      model.set('image', this.store.createRecord('image'));
    }
  }

  async saveImage() {
    if (this.fileData) {
      const imageFileData = await this.fileService.upload(this.fileData);
      const imageRecord = this.store.createRecord('image');
      imageRecord.set('file', imageFileData);
      await imageRecord.save();
      return imageRecord;
    }
    return null;
  }
}
