import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import FileService from 'mow-registry/services/file-service';

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

  setImage(model: { image?: string }, image: File | string) {
    if (this.isFileUrl(image)) {
      model.image = image;
      this.fileData = null;
    } else {
      this.fileData = image;
      model.image = this.fileData.name;
    }
  }

  async saveImage() {
    if (this.fileData) {
      return await this.fileService.upload(this.fileData);
    }

    return null;
  }
}
