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

  fileData;

  isFileUrl(file) {
    return typeof file === 'string';
  }

  @action
  setImage(changeset, image) {
    if (this.isFileUrl(image)) {
      changeset.image = image;
      this.fileData = null;
    } else {
      this.fileData = image;
      changeset.image = this.fileData.name;
    }
  }

  async saveImage(changeset) {
    if (this.fileData) {
      changeset.image = await this.fileService.upload(this.fileData);
    }
  }
}
