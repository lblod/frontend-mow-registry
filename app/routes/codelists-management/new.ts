import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class CodelistsManagementNewRoute extends Route {
  @service declare store: Store;

  model() {
    return hash({
      newCodelist: this.store.createRecord('code-list'),
    });
  }
}
