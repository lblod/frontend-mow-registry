import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

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

  async saveFile() {
    if (this.isFileUrl) {
      return this.file;
    } else {
      return await this.fileService.upload(this.file);
    }
  }
}
