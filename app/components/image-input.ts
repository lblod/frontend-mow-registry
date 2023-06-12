import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import FileService from 'mow-registry/services/file-service';

type Args = {
  setImage: (image: string | File) => void;
  error: boolean;
  oldImage: string;
};
export default class ImageInputComponent extends Component<Args> {
  @service declare fileService: FileService;
  @tracked url = '';
  @tracked file?: File;

  get source() {
    return (
      (this.isValidUrl && this.url) ||
      (this.file && URL.createObjectURL(this.file)) ||
      this.args.oldImage
    );
  }

  get isValidUrl() {
    try {
      const parsedUrl = new URL(this.url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  get showUrlError() {
    return this.url !== '' && !this.source;
  }

  imageChanged() {
    if (this.isValidUrl) {
      this.args.setImage(this.url);
    } else if (this.file) {
      this.args.setImage(this.file);
    } else {
      this.args.setImage(this.args.oldImage);
    }
  }

  @action
  setImageUrl(event: InputEvent) {
    this.url = (event.target as HTMLInputElement).value;
    this.imageChanged();
  }

  @action
  setImageUpload(event: InputEvent) {
    this.file = (event.target as HTMLInputElement).files?.[0];
    this.url = '';
    this.imageChanged();
  }
}
