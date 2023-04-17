import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

/**
 * @typedef {Object} Args
 * @property {function} setImage
 * @prop {boolean} error
 * @prop {string} oldImage
 */

/**
 * @extends {Component<Args>}
 * @property {Args} args
 */
export default class ImageInputComponent extends Component {
  @service fileService;
  @tracked url = '';
  @tracked file;

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
  setImageUrl(event) {
    this.url = event.target.value;
    this.imageChanged();
  }

  @action
  setImageUpload(event) {
    this.file = event.target.files[0];
    this.url = '';
    this.imageChanged();
  }
}
