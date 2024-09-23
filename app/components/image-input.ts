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
  @tracked file?: File;

  get source() {
    return (this.file && URL.createObjectURL(this.file)) || this.args.oldImage;
  }

  imageChanged() {
    if (this.file) {
      this.args.setImage(this.file);
    } else {
      this.args.setImage(this.args.oldImage);
    }
  }

  @action
  setImageUpload(event: InputEvent) {
    this.file = (event.target as HTMLInputElement).files?.[0];
    this.imageChanged();
  }
}
