import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CodelistController extends Controller {
  @service router;
  @tracked isOpen = false;

  get hasActiveChildRoute() {
    return (
      this.router.currentRouteName.startsWith(
        'codelists-management.codelist'
      ) &&
      this.router.currentRouteName !== 'codelists-management.codelist.index'
    );
  }

  @action
  toggleIsOpen() {
    this.isOpen = !this.isOpen;
  }

  @action
  async removeCodelist(codelist, event) {
    event.preventDefault();

    const length = codelist.codeListOptions.length;
    for (let i = 0; i < length; i++) {
      const option = codelist.codeListOptions.objectAt(0);
      await option.destroyRecord();
    }
    await codelist.destroyRecord();
    this.router.transitionTo('codelists-management');
  }

  reset() {
    this.isOpen = null;
  }
}
