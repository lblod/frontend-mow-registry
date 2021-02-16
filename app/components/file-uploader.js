import Component from '@glimmer/component';

export default class FileUploaderComponent extends Component {
  get accept() {
    return this.args.accept || 'image/jpeg,image/jpg,image/png';
  }
}
