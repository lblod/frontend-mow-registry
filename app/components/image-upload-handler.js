import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

/**
 * A helper for uploading images, used in conjunction with `image-input.js`
 * - If it is a local file, it is uploaded to the backend.
 * - If it is a URL, it will not be uploaded and instead the direct link will be used.
 *   the URL format is often used with digital asset management tools.
 */
export default class ImageUploadHandlerComponent extends Component {
  @service fileService;
  file;

  get isFileUrl() {
    return typeof this.file === 'string';
  }

  @action
  setImage(changeset, image) {
    this.file = image;
    if (this.isFileUrl) {
      changeset.image = this.file;
    } else {
      changeset.image = this.file.name;
    }
  }

  async saveImage() {
    if (this.isFileUrl) {
      return this.file;
    } else {
      return await this.fileService.upload(this.file);
    }
  }
}
