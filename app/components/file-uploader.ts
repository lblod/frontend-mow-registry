import Component from '@glimmer/component';

type Args = {
  accept: string;
};

export default class FileUploaderComponent extends Component<Args> {
  get accept() {
    return this.args.accept || 'image/jpeg,image/jpg,image/png,image/svg+xml';
  }
}
