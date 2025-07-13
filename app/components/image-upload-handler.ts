import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import FileService from 'mow-registry/services/file-service';
import Store from 'mow-registry/services/store';
import Image from 'mow-registry/models/image';
import type TrafficSignalConcept from 'mow-registry/models/traffic-signal-concept';
import type Icon from 'mow-registry/models/icon';
import type RoadSignConcept from 'mow-registry/models/road-sign-concept';

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

  setImage(model: ModelWithImage, image: File) {
    this.fileData = image;
    if (!model.image.content) {
      model.set('image', this.store.createRecord<Image>('image', {}));
    }
  }

  async saveImage() {
    if (this.fileData) {
      const imageFileData = await this.fileService.upload(this.fileData);
      const imageRecord = this.store.createRecord<Image>('image', {});
      imageRecord.set('file', imageFileData);
      await imageRecord.save();
      return imageRecord;
    }
    return null;
  }
}

// RoadSignConcept is redundant, but inheritance doesn't work as expected because of the brands.
type ModelWithImage = TrafficSignalConcept | RoadSignConcept | Icon;
