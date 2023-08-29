import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import FileService from 'mow-registry/services/file-service';
import { BufferedChangeset } from 'ember-changeset/types';

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

  fileData?: File | null;

  isFileUrl(file: File | string): file is string {
    return typeof file === 'string';
  }

  @action
  setImage(changeset: BufferedChangeset, image: File | string) {
    if (this.isFileUrl(image)) {
      changeset.image = image;
      this.fileData = null;
    } else {
      this.fileData = image;
      changeset.image = this.fileData.name;
    }
  }

  async saveImage(changeset: BufferedChangeset) {
    if (this.fileData) {
      changeset.image = await this.fileService.upload(this.fileData);
    }
  }
}
