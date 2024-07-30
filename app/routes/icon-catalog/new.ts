import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IconCatalogNewRoute extends Route {
  @service declare store: Store;

  model() {
    return {
      newIcon: this.store.createRecord('icon'),
    };
  }
}
